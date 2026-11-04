"""Commerce & Subscriptions FastAPI Router."""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user, UserContext
from app.domains.commerce.schemas import (
    ProductSchema,
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    WebhookPayload,
    WebhookResponse,
    SubscriptionResponse,
    SupportTicketCreateRequest,
    SupportTicketResponse,
)
from app.domains.commerce.service import commerce_service

router = APIRouter(prefix="/commerce", tags=["Commerce & Subscriptions"])


@router.get("/products", response_model=List[ProductSchema])
@router.get("/catalog", response_model=List[ProductSchema])
async def list_products():
    """Returns the published service catalog and active pricing tiers."""
    return commerce_service.get_service_catalog()


@router.post("/checkout", response_model=CheckoutSessionResponse)
@router.post("/checkout/session", response_model=CheckoutSessionResponse)
async def create_checkout(
    req: CheckoutSessionRequest,
    user: UserContext = Depends(get_current_user),
):
    """Initiates a subscription purchase session with transactional entitlement fulfillment."""
    return commerce_service.create_checkout_session(user_id=user.user_id, req=req)


@router.post("/webhook", response_model=WebhookResponse)
@router.post("/webhooks/{provider}", response_model=WebhookResponse)
async def payment_webhook(payload: WebhookPayload, provider: str = "mock_sandbox"):
    """Idempotently handles payment provider asynchronous webhooks (Stripe / Mock)."""
    return commerce_service.handle_payment_webhook(payload)


@router.get("/entitlements/check/{feature_key}")
async def check_entitlement(
    feature_key: str,
    user: UserContext = Depends(get_current_user),
):
    """Evaluates whether the user holds an active entitlement or safety exemption."""
    entitled = commerce_service.check_user_entitlement(user_id=user.user_id, feature_key=feature_key)
    reason = "Active subscription or institutional grant" if entitled else "No active entitlement for this feature"
    if feature_key in ["crisis_helplines", "foundation_emotions", "emergency_support"]:
        reason = "Inviolable safety & crisis guardrails are never paywalled"
    return {
        "user_id": user.user_id,
        "feature_key": feature_key,
        "is_entitled": entitled,
        "reason": reason,
    }


@router.get("/subscriptions/me", response_model=List[SubscriptionResponse])
async def get_my_subscriptions(user: UserContext = Depends(get_current_user)):
    """Returns active subscriptions and unlocked feature entitlements for the user."""
    return commerce_service.get_user_subscriptions(user_id=user.user_id)


@router.post("/subscriptions/{subscription_id}/cancel")
async def cancel_subscription(
    subscription_id: str,
    user: UserContext = Depends(get_current_user),
):
    """Schedules cancellation of an active subscription at the end of the billing period."""
    return commerce_service.cancel_subscription(
        user_id=user.user_id, subscription_id=subscription_id
    )


@router.post("/support/tickets", response_model=SupportTicketResponse)
async def create_support_ticket(
    req: SupportTicketCreateRequest,
    user: UserContext = Depends(get_current_user),
):
    """Submits a customer support or billing inquiry."""
    return commerce_service.create_support_ticket(user_id=user.user_id, req=req)


@router.get("/support/tickets", response_model=List[SupportTicketResponse])
@router.get("/support/tickets/me", response_model=List[SupportTicketResponse])
async def list_support_tickets(user: UserContext = Depends(get_current_user)):
    """Lists support inquiries submitted by the current authenticated account."""
    return commerce_service.get_user_support_tickets(user_id=user.user_id)


@router.get("/orders/me")
async def get_my_orders(user: UserContext = Depends(get_current_user)):
    """Returns order history and receipts for the authenticated family account."""
    return commerce_service.get_user_orders(user_id=user.user_id)


@router.get("/invoices/me")
async def get_my_invoices(user: UserContext = Depends(get_current_user)):
    """Returns invoices, renewal dates, and payment status for the parent dashboard."""
    return commerce_service.get_user_invoices(user_id=user.user_id)

