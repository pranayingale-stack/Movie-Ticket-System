import React, { useState, useEffect } from 'react';
import { X, Ticket, Calendar, Clock, Armchair, Trash2, Search, AlertCircle, Eye, CheckCircle2 } from 'lucide-react';
import { fetchBookings, cancelBooking } from '../api';

export default function MyBookingsModal({ onClose, onViewTicket }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadBookings = (email = null) => {
    setLoading(true);
    fetchBookings(email)
      .then((data) => setBookings(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadBookings(searchEmail.trim() || null);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket booking? Your seats will be released.')) {
      return;
    }

    setCancelLoadingId(bookingId);
    try {
      await cancelBooking(bookingId);
      setMessage('Booking cancelled successfully and seats released.');
      loadBookings(searchEmail.trim() || null);
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    } finally {
      setCancelLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">My Movie Tickets</h2>
              <p className="text-xs text-slate-400">View or manage your cinema reservations</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Lookup Filter */}
        <div className="px-5 py-3 border-b border-white/10 bg-slate-950/40">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Lookup bookings by email address..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all"
            >
              Search
            </button>
            {searchEmail && (
              <button
                type="button"
                onClick={() => {
                  setSearchEmail('');
                  loadBookings(null);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {message && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <span>{message}</span>
              <button onClick={() => setMessage('')} className="text-emerald-400 hover:text-white">
                ✕
              </button>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading your bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <Ticket className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm">No bookings found.</p>
              <p className="text-xs text-slate-600">
                Book tickets for Dune, Oppenheimer, or Interstellar at Oberoi or Infinity!
              </p>
            </div>
          ) : (
            bookings.map((b) => {
              const isCancelled = b.status === 'CANCELLED';
              const isOberoi = b.hall_name === 'Oberoi';

              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCancelled
                      ? 'bg-slate-950/40 border-white/5 opacity-60'
                      : 'bg-slate-950/70 border-white/10 hover:border-indigo-500/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            isOberoi
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {b.hall_name} Mall
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{b.screen_name}</span>
                        <span className="text-xs font-mono text-slate-500">#{b.booking_code}</span>
                      </div>

                      <h3 className="text-base font-extrabold text-white">{b.movie_title}</h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          {b.show_date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          {b.start_time}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <Armchair className="w-3.5 h-3.5" />
                          Seats: {b.seats.join(', ')}
                        </span>
                        <span>•</span>
                        <span className="font-bold text-white">₹{b.total_price.toFixed(2)}</span>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Booked for: <span className="text-slate-300">{b.user_name}</span> ({b.user_email})
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isCancelled
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {b.status}
                      </span>

                      <div className="flex items-center gap-2">
                        {!isCancelled && (
                          <button
                            onClick={() => {
                              onViewTicket(b);
                              onClose();
                            }}
                            className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all text-xs font-semibold flex items-center gap-1"
                            title="View Boarding Pass Ticket"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Pass</span>
                          </button>
                        )}

                        {!isCancelled && (
                          <button
                            disabled={cancelLoadingId === b.id}
                            onClick={() => handleCancelBooking(b.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-all text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                            title="Cancel Booking & Release Seats"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
