from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class BookingBase(BaseModel):
    event_id: int = Field(..., description="ID of the event to book")
    user_name: str = Field(..., min_length=1, max_length=255, description="Name of the person booking")
    user_email: EmailStr = Field(..., description="Email address of the person booking")
    tickets_count: int = Field(..., gt=0, description="Number of tickets to book")


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    status: str | None = Field(None, description="Booking status (e.g. CONFIRMED, CANCELLED)")


class BookingResponse(BaseModel):
    id: int
    event_id: int
    user_name: str
    user_email: str
    tickets_count: int
    total_price: float
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
