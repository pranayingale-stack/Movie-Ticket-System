from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class CinemaHallResponse(BaseModel):
    id: int
    name: str
    display_name: str
    location: str
    screen_name: str
    total_seats: int
    rows_count: int
    seats_per_row: int

    class Config:
        from_attributes = True


class MovieResponse(BaseModel):
    id: int
    title: str
    genre: str
    duration_mins: int
    rating: str
    imdb_rating: float
    language: str
    description: str | None = None
    poster_url: str
    backdrop_url: str
    release_date: str | None = None
    is_now_showing: bool

    class Config:
        from_attributes = True


class ShowtimeResponse(BaseModel):
    id: int
    movie_id: int
    hall_id: int
    hall_name: str
    screen_name: str
    show_date: str
    start_time: str
    experience: str
    base_price: float
    available_seats: int
    total_seats: int

    class Config:
        from_attributes = True


class SeatInfo(BaseModel):
    id: str  # e.g. "A1", "C5"
    row: str  # "A"
    number: int  # 1
    tier: str  # "VIP", "Prime", "Classic"
    price: float
    is_booked: bool


class SeatsLayoutResponse(BaseModel):
    showtime_id: int
    movie_title: str
    hall_name: str
    screen_name: str
    show_date: str
    start_time: str
    experience: str
    total_seats: int
    available_seats: int
    booked_seats_count: int
    seats: list[SeatInfo]


class MovieBookingCreate(BaseModel):
    showtime_id: int
    user_name: str = Field(..., min_length=2, max_length=100)
    user_email: EmailStr
    user_phone: str = Field(..., min_length=7, max_length=20)
    seats: list[str] = Field(..., min_items=1, max_items=10)


class MovieBookingResponse(BaseModel):
    id: int
    booking_code: str
    showtime_id: int
    movie_title: str
    hall_name: str
    screen_name: str
    show_date: str
    start_time: str
    user_name: str
    user_email: str
    user_phone: str
    seats: list[str]
    tickets_count: int
    total_price: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
