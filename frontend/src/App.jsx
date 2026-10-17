import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import HallFilter from './components/HallFilter';
import MovieGrid from './components/MovieGrid';
import ShowtimePickerModal from './components/ShowtimePickerModal';
import SeatCountModal from './components/SeatCountModal';
import SeatMapModal from './components/SeatMapModal';
import BookingSuccessPage from './components/BookingSuccessPage';
import MyBookingsModal from './components/MyBookingsModal';
import { fetchHalls, fetchMovies, fetchBookings } from './api';
import { Film } from 'lucide-react';

export default function App() {
  const [halls, setHalls] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedHall, setSelectedHall] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingsCount, setBookingsCount] = useState(0);

  // App Page Views: 'catalog' | 'success'
  const [currentView, setCurrentView] = useState('catalog');

  // Booking Flow States
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [targetSeatCount, setTargetSeatCount] = useState(2);
  const [activeTicket, setActiveTicket] = useState(null);

  // Modal visibility flags
  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState(false);
  const [isSeatCountModalOpen, setIsSeatCountModalOpen] = useState(false);
  const [isSeatMapModalOpen, setIsSeatMapModalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);

  // Load Halls & Movies
  useEffect(() => {
    fetchHalls()
      .then((data) => setHalls(data))
      .catch((err) => console.error('Error fetching halls:', err));

    fetchBookings()
      .then((data) => setBookingsCount(data.length))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchMovies(selectedHall, null, searchQuery)
      .then((data) => setMovies(data))
      .catch((err) => console.error('Error fetching movies:', err));
  }, [selectedHall, searchQuery]);

  // Featured movie (e.g. Dune: Part Two or first movie)
  const featuredMovie = movies.find((m) => m.title.includes('Dune')) || movies[0];

  // 1. Movie Clicked -> Open Showtime Picker
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setIsShowtimeModalOpen(true);
  };

  // 2. Showtime Selected -> Step 1: Open "How Many Seats?" Modal
  const handleSelectShowtime = (showtime) => {
    setSelectedShowtime(showtime);
    setIsShowtimeModalOpen(false);
    setIsSeatCountModalOpen(true);
  };

  // 3. Seat Count Chosen -> Step 2: Open Interactive Seat Map
  const handleSeatCountProceed = (count) => {
    setTargetSeatCount(count);
    setIsSeatCountModalOpen(false);
    setIsSeatMapModalOpen(true);
  };

  // 4. Submit button clicked on Seat Map -> Navigate directly to Success Ticket Page!
  const handleSubmitBookingSuccess = (newBooking) => {
    setActiveTicket(newBooking);
    setIsSeatMapModalOpen(false);
    setCurrentView('success');
    setBookingsCount((prev) => prev + 1);
  };

  // Return to movies catalog
  const handleReturnToCatalog = () => {
    setCurrentView('catalog');
    setActiveTicket(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        selectedHall={selectedHall}
        setSelectedHall={(hall) => {
          setSelectedHall(hall);
          if (currentView !== 'catalog') setCurrentView('catalog');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        bookingsCount={bookingsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {currentView === 'success' && activeTicket ? (
          /* Dedicated Ticket Success Page */
          <BookingSuccessPage
            booking={activeTicket}
            movie={selectedMovie}
            onBookAnotherMovie={handleReturnToCatalog}
            onOpenMyBookings={() => setIsMyBookingsOpen(true)}
          />
        ) : (
          /* Movie Catalog View */
          <>
            {/* Cinematic Spotlight Banner */}
            {!searchQuery && (
              <HeroBanner
                featuredMovie={featuredMovie}
                onBookNow={handleSelectMovie}
              />
            )}

            {/* Oberoi & Infinity Multiplexes Filter */}
            <HallFilter
              halls={halls}
              selectedHall={selectedHall}
              setSelectedHall={setSelectedHall}
            />

            {/* Movies Grid */}
            <MovieGrid
              movies={movies}
              onSelectMovie={handleSelectMovie}
              selectedHall={selectedHall}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 mt-16 py-8 px-4 text-center text-xs text-slate-500 space-y-3">
        <div className="flex items-center justify-center gap-2 text-indigo-400 font-semibold">
          <Film className="w-4 h-4" />
          <span>LUMIÈRE CINEMAS • OBEROI & INFINITY MALLS</span>
        </div>
        <p className="max-w-md mx-auto text-slate-400">
          State-of-the-art cinema ticketing system with minimum 50+ luxury seats per auditorium. Equipped with Laser 4K Projection & Dolby Atmos Surround Sound.
        </p>
        <p>© 2026 Lumière Cinemas Pvt. Ltd. All rights reserved.</p>
      </footer>

      {/* MODALS */}

      {/* Modal 1: Select Showtime for Oberoi / Infinity */}
      {isShowtimeModalOpen && (
        <ShowtimePickerModal
          movie={selectedMovie}
          selectedHall={selectedHall}
          onClose={() => setIsShowtimeModalOpen(false)}
          onSelectShowtime={handleSelectShowtime}
        />
      )}

      {/* Modal 2: "How Many Seats?" Quantity Selector */}
      {isSeatCountModalOpen && (
        <SeatCountModal
          showtime={selectedShowtime}
          onClose={() => setIsSeatCountModalOpen(false)}
          onProceed={handleSeatCountProceed}
        />
      )}

      {/* Modal 3: Interactive 60-Seat Auditorium Matrix with SUBMIT BUTTON */}
      {isSeatMapModalOpen && (
        <SeatMapModal
          showtime={selectedShowtime}
          targetSeatCount={targetSeatCount}
          onClose={() => setIsSeatMapModalOpen(false)}
          onSubmitSuccess={handleSubmitBookingSuccess}
        />
      )}

      {/* Modal 4: My Bookings Manager */}
      {isMyBookingsOpen && (
        <MyBookingsModal
          onClose={() => setIsMyBookingsOpen(false)}
          onViewTicket={(ticket) => {
            setActiveTicket(ticket);
            setCurrentView('success');
            setIsMyBookingsOpen(false);
          }}
        />
      )}
    </div>
  );
}
