import React from 'react';
import { Film, Ticket, Search, MapPin, Sparkles } from 'lucide-react';

export default function Navbar({
  selectedHall,
  setSelectedHall,
  searchQuery,
  setSearchQuery,
  onOpenMyBookings,
  bookingsCount,
}) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setSelectedHall('all')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                LUMIÈRE
              </span>
              <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold block -mt-1">
                CINEMAS
              </span>
            </div>
          </div>

          {/* Mobile Tickets Button */}
          <button
            onClick={onOpenMyBookings}
            className="md:hidden relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold"
          >
            <Ticket className="w-4 h-4" />
            <span>Tickets</span>
            {bookingsCount > 0 && (
              <span className="bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {bookingsCount}
              </span>
            )}
          </button>
        </div>

        {/* 2 Movie Halls Switcher Pills (Oberoi & Infinity) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-white/10 text-xs font-medium w-full md:w-auto justify-center">
          <button
            onClick={() => setSelectedHall('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedHall === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>All Halls</span>
          </button>

          <button
            onClick={() => setSelectedHall('Oberoi')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedHall === 'Oberoi'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Oberoi (Screen 1)</span>
          </button>

          <button
            onClick={() => setSelectedHall('Infinity')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedHall === 'Infinity'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Infinity (Screen 1)</span>
          </button>
        </div>

        {/* Search Bar & My Bookings Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button
            onClick={onOpenMyBookings}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-slate-200 border border-white/10 text-xs font-semibold shadow-sm hover:border-indigo-500/50 transition-all"
          >
            <Ticket className="w-4 h-4 text-indigo-400" />
            <span>My Bookings</span>
            {bookingsCount > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                {bookingsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
