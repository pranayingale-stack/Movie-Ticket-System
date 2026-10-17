from datetime import datetime, timezone
import json
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from db.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class CinemaHall(Base):
    __tablename__ = "cinema_halls"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False, index=True)  # "Oberoi" or "Infinity"
    display_name = Column(String(255), nullable=False)  # "Oberoi Cineplex"
    location = Column(String(255), nullable=False)
    screen_name = Column(String(100), nullable=False, default="Screen 1")
    total_seats = Column(Integer, nullable=False, default=60)
    rows_count = Column(Integer, nullable=False, default=6)  # A to F
    seats_per_row = Column(Integer, nullable=False, default=10)  # 1 to 10
    created_at = Column(DateTime(timezone=True), default=utc_now)

    # Relationships
    showtimes = relationship("Showtime", back_populates="hall", cascade="all, delete-orphan")


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False, index=True)
    genre = Column(String(100), nullable=False)
    duration_mins = Column(Integer, nullable=False)
    rating = Column(String(20), nullable=False, default="U/A")
    imdb_rating = Column(Float, nullable=False, default=8.0)
    language = Column(String(50), nullable=False, default="English")
    description = Column(Text, nullable=True)
    poster_url = Column(String(500), nullable=False)
    backdrop_url = Column(String(500), nullable=False)
    trailer_url = Column(String(500), nullable=True)
    release_date = Column(String(50), nullable=True)
    is_now_showing = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    # Relationships
    showtimes = relationship("Showtime", back_populates="movie", cascade="all, delete-orphan")


class Showtime(Base):
    __tablename__ = "showtimes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="CASCADE"), nullable=False, index=True)
    hall_id = Column(Integer, ForeignKey("cinema_halls.id", ondelete="CASCADE"), nullable=False, index=True)
    show_date = Column(String(50), nullable=False)  # e.g., "Today", "Tomorrow"
    start_time = Column(String(20), nullable=False)  # e.g., "10:30 AM"
    experience = Column(String(50), nullable=False, default="4K Dolby Atmos")  # IMAX, 4K Atmos, etc.
    base_price = Column(Float, nullable=False, default=180.0)

    # Relationships
    movie = relationship("Movie", back_populates="showtimes")
    hall = relationship("CinemaHall", back_populates="showtimes")
    bookings = relationship("MovieBooking", back_populates="showtime", cascade="all, delete-orphan")


class MovieBooking(Base):
    __tablename__ = "movie_bookings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_code = Column(String(50), unique=True, index=True, nullable=False)
    showtime_id = Column(Integer, ForeignKey("showtimes.id", ondelete="CASCADE"), nullable=False, index=True)
    hall_name = Column(String(100), nullable=False)
    screen_name = Column(String(100), nullable=False, default="Screen 1")
    movie_title = Column(String(255), nullable=False)
    user_name = Column(String(255), nullable=False)
    user_email = Column(String(255), nullable=False, index=True)
    user_phone = Column(String(50), nullable=False)
    seats = Column(Text, nullable=False)  # JSON list string e.g. '["A1", "A2"]'
    tickets_count = Column(Integer, nullable=False, default=1)
    total_price = Column(Float, nullable=False, default=0.0)
    status = Column(String(50), nullable=False, default="CONFIRMED")  # CONFIRMED or CANCELLED
    created_at = Column(DateTime(timezone=True), default=utc_now)

    # Relationships
    showtime = relationship("Showtime", back_populates="bookings")

    def get_seats_list(self) -> list[str]:
        try:
            return json.loads(self.seats)
        except Exception:
            return [s.strip() for s in self.seats.split(",") if s.strip()]
