"""Pydantic Request & Response Schemas for Commerce, Subscriptions & Support."""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class PriceSchema(BaseModel):
    id: str
    product_id: str
    amount_cents: int
    currency: str = "USD"
    billing_interval: str  # monthly, annual, one_time, free
    is_active: bool = True
    created_at: datetime


class ProductSchema(BaseModel):
    id: str
    service_type: str
    name: str
    description: str
    target_audience: str
    eligibility: str
    feature_entitlements: List[str]
    is_published: bool = True
    prices: List[PriceSchema] = Field(default_factory=list)
    created_at: datetime


class CheckoutSessionRequest(BaseModel):
    price_id: str
    payment_provider: str = "mock_sandbox"  # mock_sandbox, stripe, apple_iap
    success_url: Optional[str] = "/caregiver/dashboard?payment=success"
    cancel_url: Optional[str] = "/pricing?payment=cancelled"


class CheckoutSessionResponse(BaseModel):
    order_id: str
    checkout_url: str
    payment_provider: str
    status: str  # completed, requires_action, pending
    amount_cents: int
    currency: str
    entitlements_unlocked: List[str] = Field(default_factory=list)


class WebhookPayload(BaseModel):
    event_type: str  # payment_intent.succeeded, subscription.created, subscription.cancelled, invoice.payment_failed
    event_id: str
    order_id: str
    user_id: str
    amount_cents: int
    currency: str = "USD"
    signature: Optional[str] = None


class WebhookResponse(BaseModel):
    received: bool = True
    processed: bool = True
    idempotent_replay: bool = False
    action_taken: str


class SubscriptionResponse(BaseModel):
    id: str
    product_id: str
    product_name: str
    price_id: str
    amount_cents: int
    currency: str
    billing_interval: str
    status: str  # active, cancelled, past_due
    current_period_start: datetime
    current_period_end: datetime
    cancel_at_period_end: bool
    active_entitlements: List[str] = Field(default_factory=list)


class SupportTicketCreateRequest(BaseModel):
    subject: str
    category: str = "general"  # billing, technical, account, safeguarding
    priority: str = "medium"  # low, medium, high, urgent
    message: str


class SupportTicketResponse(BaseModel):
    id: str
    user_id: str
    subject: str
    category: str
    priority: str
    status: str  # open, in_progress, resolved, closed
    message: str
    assigned_to: Optional[str] = None
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
