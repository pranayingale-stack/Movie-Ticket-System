from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from core.config import settings
from db.database import Base, engine, SessionLocal
from db.seed import seed_database
from routers import events_router, bookings_router, cinema_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    # Seed cinema halls (Oberoi & Infinity), movies & showtimes
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="MOVIE TICKET BOOKING SYSTEM",
    description="FastAPI Backend for Cinema Ticket Booking with Oberoi and Infinity Halls",
    version="1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cinema_router, prefix=settings.API_V1_STR)
app.include_router(events_router, prefix=settings.API_V1_STR)
app.include_router(bookings_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs": f"{settings.API_V1_STR}/docs",
        "health": "/health",
        "cinema_endpoints": {
            "halls": f"{settings.API_V1_STR}/cinema/halls",
            "movies": f"{settings.API_V1_STR}/cinema/movies",
            "showtimes": f"{settings.API_V1_STR}/cinema/showtimes",
            "seats": f"{settings.API_V1_STR}/cinema/showtimes/{{showtime_id}}/seats",
            "bookings": f"{settings.API_V1_STR}/cinema/bookings",
        },
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


def main():
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
