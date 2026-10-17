from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from db.database import get_db
from models.booking import Booking
from models.event import Event
from schemas.booking import BookingCreate, BookingResponse, BookingUpdate

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking_in: BookingCreate, db: Session = Depends(get_db)):
    """Book tickets for an event."""
    event = db.query(Event).filter(Event.id == booking_in.event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id {booking_in.event_id} not found",
        )

    if event.available_tickets < booking_in.tickets_count:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not enough tickets available. Only {event.available_tickets} ticket(s) remaining.",
        )

    # Deduct available tickets
    event.available_tickets -= booking_in.tickets_count

    total_price = round(event.price * booking_in.tickets_count, 2)
    db_booking = Booking(
        event_id=booking_in.event_id,
        user_name=booking_in.user_name,
        user_email=booking_in.user_email,
        tickets_count=booking_in.tickets_count,
        total_price=total_price,
        status="CONFIRMED",
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.get("/", response_model=list[BookingResponse])
def get_bookings(
    event_id: int | None = Query(None, description="Filter by event ID"),
    user_email: str | None = Query(None, description="Filter by user email"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List bookings with optional filters for event_id and user_email."""
    query = db.query(Booking)
    if event_id is not None:
        query = query.filter(Booking.event_id == event_id)
    if user_email:
        query = query.filter(Booking.user_email.ilike(user_email))
    return query.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    """Retrieve booking by ID."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with id {booking_id} not found",
        )
    return booking


@router.patch("/{booking_id}", response_model=BookingResponse)
def update_booking_status(
    booking_id: int, booking_update: BookingUpdate, db: Session = Depends(get_db)
):
    """Update booking status (e.g., CANCELLED)."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with id {booking_id} not found",
        )

    if booking_update.status:
        new_status = booking_update.status.upper()
        if booking.status != "CANCELLED" and new_status == "CANCELLED":
            # Refund/restore tickets to the event
            event = db.query(Event).filter(Event.id == booking.event_id).first()
            if event:
                event.available_tickets = min(
                    event.total_tickets, event.available_tickets + booking.tickets_count
                )
        booking.status = new_status

    db.commit()
    db.refresh(booking)
    return booking


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    """Cancel and delete a booking, returning tickets to the pool."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with id {booking_id} not found",
        )

    if booking.status != "CANCELLED":
        event = db.query(Event).filter(Event.id == booking.event_id).first()
        if event:
            event.available_tickets = min(
                event.total_tickets, event.available_tickets + booking.tickets_count
            )

    db.delete(booking)
    db.commit()
    return None
