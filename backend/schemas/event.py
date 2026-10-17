from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class EventBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Title of the event")
    description: str | None = Field(None, description="Description of the event")
    location: str = Field(..., min_length=1, max_length=255, description="Event venue or location")
    start_time: datetime = Field(..., description="Start timestamp of the event")
    end_time: datetime = Field(..., description="End timestamp of the event")
    total_tickets: int = Field(..., gt=0, description="Total number of tickets available for this event")
    price: float = Field(0.0, ge=0.0, description="Ticket price per person")


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    location: str | None = Field(None, min_length=1, max_length=255)
    start_time: datetime | None = None
    end_time: datetime | None = None
    total_tickets: int | None = Field(None, gt=0)
    price: float | None = Field(None, ge=0.0)


class EventResponse(EventBase):
    id: int
    available_tickets: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
