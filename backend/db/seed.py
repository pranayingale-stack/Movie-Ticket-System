import json
import random
from sqlalchemy.orm import Session
from models.cinema import CinemaHall, Movie, Showtime, MovieBooking


from db.database import Base, engine


def seed_database(db: Session):
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    # Check if halls exist
    if db.query(CinemaHall).count() > 0:
        return


    print("Seeding cinema database...")

    # 1. Two Movie Halls: Oberoi and Infinity
    oberoi = CinemaHall(
        name="Oberoi",
        display_name="Oberoi Mall Cineplex",
        location="Oberoi Mall, Western Express Hwy, Goregaon East, Mumbai",
        screen_name="Screen 1 (Laser 4K Atmos)",
        total_seats=60,
        rows_count=6,
        seats_per_row=10,
    )

    infinity = CinemaHall(
        name="Infinity",
        display_name="Infinity Mall Cineplex",
        location="Infiniti Mall, Link Road, Andheri West, Mumbai",
        screen_name="Screen 1 (IMAX & Dolby Surround)",
        total_seats=60,
        rows_count=6,
        seats_per_row=10,
    )

    db.add(oberoi)
    db.add(infinity)
    db.commit()
    db.refresh(oberoi)
    db.refresh(infinity)

    # 2. Movies
    movies_data = [
        {
            "title": "Dune: Part Two",
            "genre": "Sci-Fi • Adventure",
            "duration_mins": 166,
            "rating": "U/A 16+",
            "imdb_rating": 8.6,
            "language": "English / Hindi",
            "description": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family in a visually breathtaking cosmic war.",
            "poster_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80",
            "backdrop_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
            "release_date": "March 2024",
            "is_now_showing": True,
        },
        {
            "title": "Oppenheimer",
            "genre": "Biography • Drama • History",
            "duration_mins": 180,
            "rating": "A",
            "imdb_rating": 8.9,
            "language": "English",
            "description": "Christopher Nolan's masterpiece chronicles the life of American physicist J. Robert Oppenheimer, the father of the atomic bomb, and the dramatic aftermath.",
            "poster_url": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=700&q=80",
            "backdrop_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
            "release_date": "July 2023",
            "is_now_showing": True,
        },
        {
            "title": "Interstellar",
            "genre": "Sci-Fi • Adventure • Drama",
            "duration_mins": 169,
            "rating": "U/A",
            "imdb_rating": 8.7,
            "language": "English",
            "description": "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft through a wormhole to find humanity a new home.",
            "poster_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=80",
            "backdrop_url": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80",
            "release_date": "Special Re-Release",
            "is_now_showing": True,
        },
        {
            "title": "Spider-Man: Across the Spider-Verse",
            "genre": "Animation • Action • Sci-Fi",
            "duration_mins": 140,
            "rating": "U/A",
            "imdb_rating": 8.7,
            "language": "English / Hindi",
            "description": "Miles Morales is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence, but must redefine what it means to be a hero.",
            "poster_url": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=700&q=80",
            "backdrop_url": "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80",
            "release_date": "June 2023",
            "is_now_showing": True,
        },
        {
            "title": "The Dark Knight",
            "genre": "Action • Crime • Drama",
            "duration_mins": 152,
            "rating": "U/A 16+",
            "imdb_rating": 9.0,
            "language": "English",
            "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            "poster_url": "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=700&q=80",
            "backdrop_url": "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80",
            "release_date": "IMAX Re-Master",
            "is_now_showing": True,
        },
        {
            "title": "Inception",
            "genre": "Sci-Fi • Action • Mind-Bending",
            "duration_mins": 148,
            "rating": "U/A",
            "imdb_rating": 8.8,
            "language": "English",
            "description": "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction: stealing valuable secrets from deep within the subconscious during the dream state.",
            "poster_url": "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=700&q=80",
            "backdrop_url": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80",
            "release_date": "Digital 4K Restored",
            "is_now_showing": True,
        },
    ]

    movie_objs = []
    for m in movies_data:
        m_obj = Movie(**m)
        db.add(m_obj)
        movie_objs.append(m_obj)
    db.commit()

    for m_obj in movie_objs:
        db.refresh(m_obj)

    # 3. Showtimes for both Oberoi and Infinity
    timings = [
        ("Today", "10:30 AM", 180.0, "Laser 4K Atmos"),
        ("Today", "02:15 PM", 220.0, "Dolby Atmos 7.1"),
        ("Today", "06:00 PM", 280.0, "Prime 4K Experience"),
        ("Today", "09:45 PM", 250.0, "Late Night Atmos"),
        ("Tomorrow", "11:00 AM", 180.0, "Laser 4K Atmos"),
        ("Tomorrow", "03:30 PM", 220.0, "Dolby Atmos 7.1"),
        ("Tomorrow", "07:15 PM", 280.0, "Prime 4K Experience"),
        ("Tomorrow", "10:30 PM", 250.0, "Late Night Atmos"),
    ]

    showtimes = []
    halls = [oberoi, infinity]

    for m in movie_objs:
        for hall in halls:
            # Add select showtimes for each movie in each hall
            # Use different subset of timings per movie to make it realistic
            selected_timings = timings[::2] if hall.name == "Oberoi" else timings[1::2]
            for date_str, time_str, price, exp in selected_timings:
                st = Showtime(
                    movie_id=m.id,
                    hall_id=hall.id,
                    show_date=date_str,
                    start_time=time_str,
                    experience=exp,
                    base_price=price,
                )
                db.add(st)
                showtimes.append(st)

    db.commit()
    for st in showtimes:
        db.refresh(st)

    # 4. Seed a few initial bookings so some seats appear occupied
    sample_seats_sets = [
        ["C4", "C5"],
        ["D6", "D7", "D8"],
        ["B3", "B4"],
        ["A5"],
    ]

    sample_users = [
        ("Aarav Sharma", "aarav@example.com", "+91 98201 12345"),
        ("Rhea Mehta", "rhea@example.com", "+91 98202 23456"),
        ("Vikram Singh", "vikram@example.com", "+91 98203 34567"),
    ]

    for i, st in enumerate(showtimes[:8]):
        seats_booked = sample_seats_sets[i % len(sample_seats_sets)]
        user = sample_users[i % len(sample_users)]
        hall = db.query(CinemaHall).filter(CinemaHall.id == st.hall_id).first()
        movie = db.query(Movie).filter(Movie.id == st.movie_id).first()

        code_prefix = "OBR" if hall.name == "Oberoi" else "INF"
        booking_code = f"{code_prefix}-{random.randint(100000, 999999)}"

        total_price = st.base_price * len(seats_booked)

        booking = MovieBooking(
            booking_code=booking_code,
            showtime_id=st.id,
            hall_name=hall.name,
            screen_name=hall.screen_name,
            movie_title=movie.title,
            user_name=user[0],
            user_email=user[1],
            user_phone=user[2],
            seats=json.dumps(seats_booked),
            tickets_count=len(seats_booked),
            total_price=round(total_price, 2),
            status="CONFIRMED",
        )
        db.add(booking)

    db.commit()
    print("Database seeding completed successfully!")
