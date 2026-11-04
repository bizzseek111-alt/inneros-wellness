"""Commerce, Subscription Management & Entitlement Engine."""

import json
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy import select, desc
from fastapi import HTTPException, status

from app.db.database import db_session, init_db
from app.db.models import (
    ProductModel,
    PriceModel,
    OrderModel,
    PaymentModel,
    SubscriptionModel,
    EntitlementModel,
    SupportTicketModel,
    UserModel,
    AdminAuditLogModel,
)
from app.domains.commerce.schemas import (
    ProductSchema,
    PriceSchema,
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    WebhookPayload,
    WebhookResponse,
    SubscriptionResponse,
    SupportTicketCreateRequest,
    SupportTicketResponse,
)


class CommerceService:
    """Provides provider-agnostic billing, entitlement enforcement, and support workflows."""

    def __init__(self):
        init_db()

    def get_service_catalog(self) -> List[ProductSchema]:
        """Retrieves all published products and their active pricing plans."""
        with db_session() as db:
            products = db.scalars(
                select(ProductModel).where(ProductModel.is_published == True)
            ).all()

            result = []
            for prod in products:
                prices = db.scalars(
                    select(PriceModel).where(
                        PriceModel.product_id == prod.id,
                        PriceModel.is_active == True,
                    )
                ).all()

                price_schemas = [
                    PriceSchema(
                        id=pr.id,
                        product_id=pr.product_id,
                        amount_cents=pr.amount_cents,
                        currency=pr.currency,
                        billing_interval=pr.billing_interval,
                        is_active=pr.is_active,
                        created_at=pr.created_at,
                    )
                    for pr in prices
                ]

                entitlements = []
                try:
                    entitlements = json.loads(prod.feature_entitlements_json)
                except Exception:
                    pass

                result.append(
                    ProductSchema(
                        id=prod.id,
                        service_type=prod.service_type,
                        name=prod.name,
                        description=prod.description,
                        target_audience=prod.target_audience,
                        eligibility=prod.eligibility,
                        feature_entitlements=entitlements,
                        is_published=prod.is_published,
                        prices=price_schemas,
                        created_at=prod.created_at,
                    )
                )

            return result

    def create_checkout_session(
        self, user_id: str, req: CheckoutSessionRequest
    ) -> CheckoutSessionResponse:
        """Creates an order and initiates checkout.

        In development / mock_sandbox mode, it completes payment transactionally and activates entitlements.
        """
        now = datetime.now(timezone.utc)
        order_id = f"ord_{uuid.uuid4().hex[:12]}"

        with db_session() as db:
            price = db.get(PriceModel, req.price_id)
            if not price:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Pricing plan not found.",
                )

            product = db.get(ProductModel, price.product_id)
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Associated product catalog entry not found.",
                )

            # 1. Create Order
            order = OrderModel(
                id=order_id,
                user_id=user_id,
                product_id=product.id,
                price_id=price.id,
                amount_cents=price.amount_cents,
                currency=price.currency,
                status="completed" if req.payment_provider == "mock_sandbox" else "pending",
                payment_provider=req.payment_provider,
                created_at=now,
                updated_at=now,
            )
            db.add(order)

            unlocked_entitlements = []
            try:
                unlocked_entitlements = json.loads(product.feature_entitlements_json)
            except Exception:
                pass

            # 2. In Sandbox mode, immediately process transaction and unlock entitlements
            if req.payment_provider == "mock_sandbox":
                payment_id = f"pay_mock_{uuid.uuid4().hex[:8]}"
                payment = PaymentModel(
                    id=payment_id,
                    order_id=order_id,
                    provider_payment_id=f"sandbox_tx_{uuid.uuid4().hex[:8]}",
                    amount_cents=price.amount_cents,
                    currency=price.currency,
                    status="succeeded",
                    idempotency_key=f"idem_{order_id}",
                    created_at=now,
                )
                db.add(payment)

                # Create or extend subscription
                period_duration = (
                    timedelta(days=365)
                    if price.billing_interval == "annual"
                    else timedelta(days=30)
                )

                sub = SubscriptionModel(
                    id=f"sub_{uuid.uuid4().hex[:10]}",
                    user_id=user_id,
                    product_id=product.id,
                    price_id=price.id,
                    status="active",
                    current_period_start=now,
                    current_period_end=now + period_duration,
                    cancel_at_period_end=False,
                    created_at=now,
                    updated_at=now,
                )
                db.add(sub)

                # Grant entitlements
                for feat in unlocked_entitlements:
                    existing_ent = db.scalars(
                        select(EntitlementModel).where(
                            EntitlementModel.user_id == user_id,
                            EntitlementModel.feature_key == feat,
                        )
                    ).first()
                    if existing_ent:
                        existing_ent.is_active = True
                        existing_ent.expires_at = now + period_duration
                    else:
                        db.add(
                            EntitlementModel(
                                id=f"ent_{uuid.uuid4().hex[:8]}",
                                user_id=user_id,
                                feature_key=feat,
                                granted_via="subscription",
                                is_active=True,
                                expires_at=now + period_duration,
                                created_at=now,
                            )
                        )

            checkout_url = req.success_url or "/caregiver/dashboard?payment=success"

            return CheckoutSessionResponse(
                order_id=order_id,
                checkout_url=checkout_url,
                payment_provider=req.payment_provider,
                status="completed" if req.payment_provider == "mock_sandbox" else "pending",
                amount_cents=price.amount_cents,
                currency=price.currency,
                entitlements_unlocked=unlocked_entitlements,
            )

    def handle_payment_webhook(self, payload: WebhookPayload) -> WebhookResponse:
        """Idempotently processes payment provider webhooks (Stripe / Apple / Mock)."""
        now = datetime.now(timezone.utc)
        idem_key = f"idem_webhook_{payload.event_id}"

        with db_session() as db:
            existing_payment = db.scalars(
                select(PaymentModel).where(PaymentModel.idempotency_key == idem_key)
            ).first()

            if existing_payment:
                return WebhookResponse(
                    received=True,
                    processed=True,
                    idempotent_replay=True,
                    action_taken="Idempotent duplicate event ignored without duplicate billing.",
                )

            if payload.event_type == "payment_intent.succeeded":
                payment = PaymentModel(
                    id=f"pay_{uuid.uuid4().hex[:10]}",
                    order_id=payload.order_id,
                    provider_payment_id=payload.event_id,
                    amount_cents=payload.amount_cents,
                    currency=payload.currency,
                    status="succeeded",
                    idempotency_key=idem_key,
                    created_at=now,
                )
                db.add(payment)

                # Mark order completed
                order = db.get(OrderModel, payload.order_id)
                if order:
                    order.status = "completed"
                    order.updated_at = now

                return WebhookResponse(
                    received=True,
                    processed=True,
                    idempotent_replay=False,
                    action_taken="Payment verified and order marked completed.",
                )

            return WebhookResponse(
                received=True,
                processed=True,
                idempotent_replay=False,
                action_taken=f"Event {payload.event_type} acknowledged.",
            )

    def get_user_subscriptions(self, user_id: str) -> List[SubscriptionResponse]:
        """Retrieves active subscriptions and entitlements for the authenticated user."""
        with db_session() as db:
            subs = db.scalars(
                select(SubscriptionModel)
                .where(SubscriptionModel.user_id == user_id)
                .order_by(desc(SubscriptionModel.created_at))
            ).all()

            entitlements = db.scalars(
                select(EntitlementModel.feature_key).where(
                    EntitlementModel.user_id == user_id,
                    EntitlementModel.is_active == True,
                )
            ).all()

            result = []
            for sub in subs:
                prod = db.get(ProductModel, sub.product_id)
                price = db.get(PriceModel, sub.price_id)

                result.append(
                    SubscriptionResponse(
                        id=sub.id,
                        product_id=sub.product_id,
                        product_name=prod.name if prod else "InnerOS Learning Service",
                        price_id=sub.price_id,
                        amount_cents=price.amount_cents if price else 0,
                        currency=price.currency if price else "USD",
                        billing_interval=price.billing_interval if price else "monthly",
                        status=sub.status,
                        current_period_start=sub.current_period_start,
                        current_period_end=sub.current_period_end,
                        cancel_at_period_end=sub.cancel_at_period_end,
                        active_entitlements=list(entitlements),
                    )
                )

            return result

    def cancel_subscription(self, user_id: str, subscription_id: str) -> Dict[str, Any]:
        """Cancels a subscription at period end."""
        with db_session() as db:
            sub = db.get(SubscriptionModel, subscription_id)
            if not sub or sub.user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Subscription not found.",
                )

            sub.cancel_at_period_end = True
            sub.status = "cancelled"
            sub.updated_at = datetime.now(timezone.utc)

            return {
                "subscription_id": sub.id,
                "status": "cancelled",
                "message": "Subscription will not renew after current period.",
                "active_until": sub.current_period_end.isoformat(),
            }

    def check_user_entitlement(self, user_id: str, feature_key: str) -> bool:
        """Evaluates if user possesses active entitlement. Essential safety resources always return True."""
        # Universal safety invariants: crisis lines & fundamental affect tools are NEVER gated
        if feature_key in ["crisis_helplines", "foundation_emotions", "emergency_support"]:
            return True

        with db_session() as db:
            ent = db.scalars(
                select(EntitlementModel).where(
                    EntitlementModel.user_id == user_id,
                    EntitlementModel.feature_key == feature_key,
                    EntitlementModel.is_active == True,
                )
            ).first()

            if not ent:
                return False

            if ent.expires_at:
                exp = ent.expires_at
                if exp.tzinfo is None:
                    exp = exp.replace(tzinfo=timezone.utc)
                if exp < datetime.now(timezone.utc):
                    ent.is_active = False
                    return False

            return True

    # -------------------------------------------------------------------------
    # Customer Support Tickets
    # -------------------------------------------------------------------------
    def create_support_ticket(
        self, user_id: str, req: SupportTicketCreateRequest
    ) -> SupportTicketResponse:
        """Submits a customer support ticket."""
        now = datetime.now(timezone.utc)
        ticket_id = f"tkt_{uuid.uuid4().hex[:8]}"

        with db_session() as db:
            tkt = SupportTicketModel(
                id=ticket_id,
                user_id=user_id,
                subject=req.subject,
                category=req.category,
                priority=req.priority,
                status="open",
                message=req.message,
                created_at=now,
                updated_at=now,
            )
            db.add(tkt)

            return SupportTicketResponse(
                id=tkt.id,
                user_id=tkt.user_id,
                subject=tkt.subject,
                category=tkt.category,
                priority=tkt.priority,
                status=tkt.status,
                message=tkt.message,
                created_at=tkt.created_at,
                updated_at=tkt.updated_at,
            )

    def get_user_support_tickets(self, user_id: str) -> List[SupportTicketResponse]:
        """Lists support tickets submitted by the authenticated user."""
        with db_session() as db:
            tickets = db.scalars(
                select(SupportTicketModel)
                .where(SupportTicketModel.user_id == user_id)
                .order_by(desc(SupportTicketModel.created_at))
            ).all()

            return [
                SupportTicketResponse(
                    id=t.id,
                    user_id=t.user_id,
                    subject=t.subject,
                    category=t.category,
                    priority=t.priority,
                    status=t.status,
                    message=t.message,
                    assigned_to=t.assigned_to,
                    resolution_notes=t.resolution_notes,
                    created_at=t.created_at,
                    updated_at=t.updated_at,
                )
                for t in tickets
            ]

    def get_user_orders(self, user_id: str) -> List[Dict[str, Any]]:
        """Lists purchase orders for the user."""
        with db_session() as db:
            orders = db.scalars(
                select(OrderModel)
                .where(OrderModel.user_id == user_id)
                .order_by(desc(OrderModel.created_at))
            ).all()
            products_map = {p.id: p for p in db.scalars(select(ProductModel)).all()}
            return [
                {
                    "id": o.id,
                    "product_id": o.product_id,
                    "product_name": products_map.get(o.product_id).name if products_map.get(o.product_id) else o.product_id,
                    "amount_cents": o.amount_cents,
                    "currency": o.currency,
                    "status": o.status,
                    "payment_provider": o.payment_provider,
                    "created_at": o.created_at.isoformat() if o.created_at else None,
                }
                for o in orders
            ]

    def get_user_invoices(self, user_id: str) -> List[Dict[str, Any]]:
        """Generates itemized invoice and renewal records for the parent billing portal."""
        with db_session() as db:
            orders = db.scalars(
                select(OrderModel)
                .where(OrderModel.user_id == user_id)
                .order_by(desc(OrderModel.created_at))
            ).all()
            subs = db.scalars(select(SubscriptionModel).where(SubscriptionModel.user_id == user_id)).all()
            products_map = {p.id: p for p in db.scalars(select(ProductModel)).all()}

            invoices = []
            for idx, o in enumerate(orders):
                prod = products_map.get(o.product_id)
                matching_sub = next((s for s in subs if s.product_id == o.product_id), None)
                renewal_date = matching_sub.current_period_end.isoformat() if matching_sub else None
                invoices.append({
                    "invoice_number": f"INV-2026-{o.id[-6:].upper()}",
                    "order_id": o.id,
                    "date": o.created_at.strftime("%b %d, %Y") if o.created_at else "Nov 04, 2026",
                    "description": prod.name if prod else "InnerOS Family Plan",
                    "amount_cents": o.amount_cents,
                    "currency": o.currency,
                    "status": "Paid" if o.status == "completed" else o.status.capitalize(),
                    "payment_method": "Simulated Sandbox Card (•••• 4242)" if o.payment_provider == "mock_sandbox" else o.payment_provider,
                    "renewal_date": renewal_date,
                    "pdf_download_url": f"/api/v1/commerce/invoices/{o.id}/pdf",
                })
            return invoices


commerce_service = CommerceService()
