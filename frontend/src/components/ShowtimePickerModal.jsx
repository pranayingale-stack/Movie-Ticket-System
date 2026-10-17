import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Tv, Clock, Star, Armchair, ChevronRight, Sparkles } from 'lucide-react';
import { fetchShowtimes } from '../api';

export default function ShowtimePickerModal({ movie, onClose, onSelectShowtime, selectedHall }) {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movie) return;
    setLoading(true);
    fetchShowtimes(movie.id, selectedHall === 'all' ? null : selectedHall, selectedDate)
      .then((data) => setShowtimes(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [movie, selectedHall, selectedDate]);

  if (!movie) return null;

  // Group showtimes by hall name
  const oberoiShowtimes = showtimes.filter((st) => st.hall_name === 'Oberoi');
  const infinityShowtimes = showtimes.filter((st) => st.hall_name === 'Infinity');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col">
        {/* Header with Movie Backdrop banner */}
        <div className="relative p-6 border-b border-white/10 bg-gradient-to-b from-slate-800/80 to-slate-900">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-4 md:gap-6 items-center">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-20 md:w-24 h-28 md:h-36 object-cover rounded-xl shadow-lg border border-white/10 shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <span>{movie.genre}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.imdb_rating}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                {movie.title}
              </h2>

              <p className="text-xs text-slate-400 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {movie.duration_mins} mins
                </span>
                <span>•</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[11px] font-semibold text-slate-300">
                  {movie.rating}
                </span>
                <span>•</span>
                <span>{movie.language}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Date Selector Tabs */}
        <div className="px-6 py-3 border-b border-white/10 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Select Date:</span>
          </div>
          {['Today', 'Tomorrow'].map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDate === date
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Showtimes by Cinema Hall */}
        <div className="p-6 space-y-6 flex-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading showtimes...
            </div>
          ) : showtimes.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No showtimes scheduled for this date.
            </div>
          ) : (
            <>
              {/* Oberoi Cineplex Section */}
              {(selectedHall === 'all' || selectedHall === 'Oberoi') && (
                <div className="bg-slate-950/50 rounded-2xl p-5 border border-white/5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-500/20 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-md border border-amber-500/30 uppercase">
                          Oberoi Mall
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Tv className="w-3.5 h-3.5 text-indigo-400" />
                          Screen 1 (Laser 4K Atmos)
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        Oberoi Cineplex - Screen 1
                      </h3>
                      <p className="text-xs text-slate-500">Goregaon East, Western Express Hwy</p>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Armchair className="w-3.5 h-3.5 text-emerald-400" />
                      60 Seats Audi
                    </span>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2.5">
                    {oberoiShowtimes.length === 0 ? (
                      <span className="text-xs text-slate-500">No shows available for this day.</span>
                    ) : (
                      oberoiShowtimes.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => onSelectShowtime(st)}
                          className="group relative px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 text-white transition-all shadow-sm flex flex-col items-center hover:scale-105"
                        >
                          <span className="text-sm font-extrabold group-hover:text-white">
                            {st.start_time}
                          </span>
                          <span className="text-[10px] text-slate-400 group-hover:text-indigo-200">
                            {st.experience}
                          </span>
                          <span className="text-[10px] text-emerald-400 group-hover:text-emerald-200 font-semibold mt-0.5">
                            {st.available_seats} seats left
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Infinity Cineplex Section */}
              {(selectedHall === 'all' || selectedHall === 'Infinity') && (
                <div className="bg-slate-950/50 rounded-2xl p-5 border border-white/5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-cyan-500/20 text-cyan-300 text-[11px] font-bold px-2 py-0.5 rounded-md border border-cyan-500/30 uppercase">
                          Infinity Mall
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Tv className="w-3.5 h-3.5 text-indigo-400" />
                          Screen 1 (IMAX & Dolby Surround)
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        Infinity Cineplex - Screen 1
                      </h3>
                      <p className="text-xs text-slate-500">Andheri West, Link Road</p>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Armchair className="w-3.5 h-3.5 text-cyan-400" />
                      60 Seats Audi
                    </span>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2.5">
                    {infinityShowtimes.length === 0 ? (
                      <span className="text-xs text-slate-500">No shows available for this day.</span>
                    ) : (
                      infinityShowtimes.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => onSelectShowtime(st)}
                          className="group relative px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-600 border border-white/10 hover:border-cyan-500 text-white transition-all shadow-sm flex flex-col items-center hover:scale-105"
                        >
                          <span className="text-sm font-extrabold group-hover:text-white">
                            {st.start_time}
                          </span>
                          <span className="text-[10px] text-slate-400 group-hover:text-cyan-200">
                            {st.experience}
                          </span>
                          <span className="text-[10px] text-emerald-400 group-hover:text-emerald-200 font-semibold mt-0.5">
                            {st.available_seats} seats left
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
