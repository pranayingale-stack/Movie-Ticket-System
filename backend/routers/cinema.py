import json
import random
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from db.database import get_db
from models.cinema import CinemaHall, Movie, Showtime, MovieBooking
from schemas.cinema import (
    CinemaHallResponse,
    MovieResponse,
    ShowtimeResponse,
    SeatInfo,
    SeatsLayoutResponse,
    MovieBookingCreate,
    MovieBookingResponse,
)

router = APIRouter(prefix="/cinema", tags=["Cinema & Movie Tickets"])


# 1. Cinema Halls (Oberoi & Infinity)
@router.get("/halls", response_model=list[CinemaHallResponse])
def get_halls(db: Session = Depends(get_db)):
    """Retrieve all available movie halls (Oberoi & Infinity)."""
    return db.query(CinemaHall).order_by(CinemaHall.name.asc()).all()


# 2. Movies
@router.get("/movies", response_model=list[MovieResponse])
def get_movies(
    hall_name: str | None = Query(None, description="Filter movies playing in Oberoi or Infinity"),
    genre: str | None = Query(None, description="Filter by genre"),
    search: str | None = Query(None, description="Search by title"),
    db: Session = Depends(get_db),
):
    """List now showing movies with optional filtering."""
    query = db.query(Movie).filter(Movie.is_now_showing == True)

    if hall_name:
        hall = db.query(CinemaHall).filter(CinemaHall.name.ilike(hall_name)).first()
        if hall:
            query = query.join(Showtime, Showtime.movie_id == Movie.id).filter(Showtime.hall_id == hall.id)

    if genre:
        query = query.filter(Movie.genre.ilike(f"%{genre}%"))

    if search:
        query = query.filter(Movie.title.ilike(f"%{search}%"))

    return query.distinct().order_by(Movie.imdb_rating.desc()).all()


@router.get("/movies/{movie_id}", response_model=MovieResponse)
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    """Get movie details by ID."""
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Movie with id {movie_id} not found",
        )
    return movie


# 3. Showtimes
@router.get("/showtimes", response_model=list[ShowtimeResponse])
def get_showtimes(
    movie_id: int | None = Query(None, description="Filter by Movie ID"),
    hall_name: str | None = Query(None, description="Filter by Hall ('Oberoi' or 'Infinity')"),
    show_date: str | None = Query(None, description="Filter by date ('Today', 'Tomorrow')"),
    db: Session = Depends(get_db),
):
    """Retrieve showtimes with movie and hall details."""
    query = db.query(Showtime).join(CinemaHall, Showtime.hall_id == CinemaHall.id)

    if movie_id:
        query = query.filter(Showtime.movie_id == movie_id)
    if hall_name:
        query = query.filter(CinemaHall.name.ilike(hall_name))
    if show_date:
        query = query.filter(Showtime.show_date.ilike(show_date))

    showtimes = query.all()
    results = []

    for st in showtimes:
        # Calculate booked seats
        booked_bookings = (
            db.query(MovieBooking)
            .filter(MovieBooking.showtime_id == st.id, MovieBooking.status == "CONFIRMED")
            .all()
        )
        total_booked_seats = sum(b.tickets_count for b in booked_bookings)
        avail = max(0, st.hall.total_seats - total_booked_seats)

        results.append(
            ShowtimeResponse(
                id=st.id,
                movie_id=st.movie_id,
                hall_id=st.hall_id,
                hall_name=st.hall.name,
                screen_name=st.hall.screen_name,
                show_date=st.show_date,
                start_time=st.start_time,
                experience=st.experience,
                base_price=st.base_price,
                available_seats=avail,
                total_seats=st.hall.total_seats,
            )
        )

    return results


# 4. Seat Layout & Selection
@router.get("/showtimes/{showtime_id}/seats", response_model=SeatsLayoutResponse)
def get_showtime_seats(showtime_id: int, db: Session = Depends(get_db)):
    """Retrieve complete 60-seat matrix for a showtime, with booked and available flags."""
    showtime = db.query(Showtime).filter(Showtime.id == showtime_id).first()
    if not showtime:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Showtime with id {showtime_id} not found",
        )

    hall = showtime.hall
    movie = showtime.movie

    # Fetch all confirmed bookings for this showtime
    bookings = (
        db.query(MovieBooking)
        .filter(MovieBooking.showtime_id == showtime_id, MovieBooking.status == "CONFIRMED")
        .all()
    )

    booked_seats_set = set()
    for b in bookings:
        for seat_id in b.get_seats_list():
            booked_seats_set.add(seat_id.upper().strip())

    # Build 60 seats (Rows A-F, cols 1-10)
    # Row A, B: VIP Recliners (Base + 120)
    # Row C, D: Prime Executive (Base + 50)
    # Row E, F: Classic Standard (Base)
    rows = ["A", "B", "C", "D", "E", "F"][: hall.rows_count]
    cols = list(range(1, hall.seats_per_row + 1))

    seats_list: list[SeatInfo] = []

    for r in rows:
        if r in ["A", "B"]:
            tier = "VIP Recliner"
            tier_price = showtime.base_price + 120.0
        elif r in ["C", "D"]:
            tier = "Prime Executive"
            tier_price = showtime.base_price + 50.0
        else:
            tier = "Classic Standard"
            tier_price = showtime.base_price

        for c in cols:
            seat_code = f"{r}{c}"
            is_booked = seat_code in booked_seats_set
            seats_list.append(
                SeatInfo(
                    id=seat_code,
                    row=r,
                    number=c,
                    tier=tier,
                    price=tier_price,
                    is_booked=is_booked,
                )
            )

    available_count = len([s for s in seats_list if not s.is_booked])
    booked_count = len([s for s in seats_list if s.is_booked])

    return SeatsLayoutResponse(
        showtime_id=showtime.id,
        movie_title=movie.title,
        hall_name=hall.name,
        screen_name=hall.screen_name,
        show_date=showtime.show_date,
        start_time=showtime.start_time,
        experience=showtime.experience,
        total_seats=hall.total_seats,
        available_seats=available_count,
        booked_seats_count=booked_count,
        seats=seats_list,
    )


# 5. Bookings
@router.post("/bookings", response_model=MovieBookingResponse, status_code=status.HTTP_201_CREATED)
def create_movie_booking(booking_in: MovieBookingCreate, db: Session = Depends(get_db)):
    """Book selected seats for a showtime."""
    showtime = db.query(Showtime).filter(Showtime.id == booking_in.showtime_id).first()
    if not showtime:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Showtime with id {booking_in.showtime_id} not found",
        )

    hall = showtime.hall
    movie = showtime.movie

    # Normalize seat codes
    requested_seats = [s.strip().upper() for s in booking_in.seats if s.strip()]
    if not requested_seats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one seat must be selected.",
        )

    # Check for duplicate seat codes in request
    if len(requested_seats) != len(set(requested_seats)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duplicate seat selections found.",
        )

    # Validate all requested seats exist in hall
    valid_rows = set(["A", "B", "C", "D", "E", "F"][: hall.rows_count])
    for s in requested_seats:
        row = s[0]
        col_str = s[1:]
        if row not in valid_rows or not col_str.isdigit() or int(col_str) > hall.seats_per_row or int(col_str) < 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Seat {s} is not a valid seat in {hall.name} ({hall.screen_name}).",
            )

    # Check if any seat is already booked
    existing_bookings = (
        db.query(MovieBooking)
        .filter(MovieBooking.showtime_id == showtime.id, MovieBooking.status == "CONFIRMED")
        .all()
    )

    already_booked = set()
    for b in existing_bookings:
        for s in b.get_seats_list():
            already_booked.add(s.upper())

    conflicts = [s for s in requested_seats if s in already_booked]
    if conflicts:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Seats {', '.join(conflicts)} are already booked! Please select other seats.",
        )

    # Calculate exact total price per tier
    total_price = 0.0
    for s in requested_seats:
        row = s[0]
        if row in ["A", "B"]:
            seat_price = showtime.base_price + 120.0
        elif row in ["C", "D"]:
            seat_price = showtime.base_price + 50.0
        else:
            seat_price = showtime.base_price
        total_price += seat_price

    prefix = "OBR" if hall.name == "Oberoi" else "INF"
    booking_code = f"{prefix}-{random.randint(100000, 999999)}"

    new_booking = MovieBooking(
        booking_code=booking_code,
        showtime_id=showtime.id,
        hall_name=hall.name,
        screen_name=hall.screen_name,
        movie_title=movie.title,
        user_name=booking_in.user_name,
        user_email=booking_in.user_email,
        user_phone=booking_in.user_phone,
        seats=json.dumps(requested_seats),
        tickets_count=len(requested_seats),
        total_price=round(total_price, 2),
        status="CONFIRMED",
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return MovieBookingResponse(
        id=new_booking.id,
        booking_code=new_booking.booking_code,
        showtime_id=new_booking.showtime_id,
        movie_title=new_booking.movie_title,
        hall_name=new_booking.hall_name,
        screen_name=new_booking.screen_name,
        show_date=showtime.show_date,
        start_time=showtime.start_time,
        user_name=new_booking.user_name,
        user_email=new_booking.user_email,
        user_phone=new_booking.user_phone,
        seats=new_booking.get_seats_list(),
        tickets_count=new_booking.tickets_count,
        total_price=new_booking.total_price,
        status=new_booking.status,
        created_at=new_booking.created_at,
    )


@router.get("/bookings", response_model=list[MovieBookingResponse])
def get_user_bookings(
    email: str | None = Query(None, description="Filter by user email"),
    db: Session = Depends(get_db),
):
    """Retrieve all movie bookings or filter by user email."""
    query = db.query(MovieBooking)
    if email:
        query = query.filter(MovieBooking.user_email.ilike(email))

    bookings = query.order_by(MovieBooking.created_at.desc()).all()
    results = []

    for b in bookings:
        st = b.showtime
        show_date = st.show_date if st else "N/A"
        start_time = st.start_time if st else "N/A"

        results.append(
            MovieBookingResponse(
                id=b.id,
                booking_code=b.booking_code,
                showtime_id=b.showtime_id,
                movie_title=b.movie_title,
                hall_name=b.hall_name,
                screen_name=b.screen_name,
                show_date=show_date,
                start_time=start_time,
                user_name=b.user_name,
                user_email=b.user_email,
                user_phone=b.user_phone,
                seats=b.get_seats_list(),
                tickets_count=b.tickets_count,
                total_price=b.total_price,
                status=b.status,
                created_at=b.created_at,
            )
        )
    return results


@router.post("/bookings/{booking_id}/cancel", response_model=MovieBookingResponse)
def cancel_movie_booking(booking_id: int, db: Session = Depends(get_db)):
    """Cancel a booking and release its seats."""
    booking = db.query(MovieBooking).filter(MovieBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with id {booking_id} not found",
        )

    if booking.status == "CANCELLED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is already cancelled",
        )

    booking.status = "CANCELLED"
    db.commit()
    db.refresh(booking)

    st = booking.showtime
    return MovieBookingResponse(
        id=booking.id,
        booking_code=booking.booking_code,
        showtime_id=booking.showtime_id,
        movie_title=booking.movie_title,
        hall_name=booking.hall_name,
        screen_name=booking.screen_name,
        show_date=st.show_date if st else "N/A",
        start_time=st.start_time if st else "N/A",
        user_name=booking.user_name,
        user_email=booking.user_email,
        user_phone=booking.user_phone,
        seats=booking.get_seats_list(),
        tickets_count=booking.tickets_count,
        total_price=booking.total_price,
        status=booking.status,
        created_at=booking.created_at,
    )
