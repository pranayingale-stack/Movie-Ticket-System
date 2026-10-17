import React, { useState, useEffect } from 'react';
import {
  X,
  Tv,
  Armchair,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { fetchShowtimeSeats, createBooking } from '../api';

export default function SeatMapModal({
  showtime,
  targetSeatCount,
  onClose,
  onSubmitSuccess,
}) {
  const [layoutData, setLayoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);

  // Patron details
  const [userName, setUserName] = useState('Pranay Ingale');
  const [userEmail, setUserEmail] = useState('pranay@example.com');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [showDetailsForm, setShowDetailsForm] = useState(false);

  useEffect(() => {
    if (!showtime) return;
    setLoading(true);
    fetchShowtimeSeats(showtime.id)
      .then((data) => {
        setLayoutData(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load auditorium seating layout.');
      })
      .finally(() => setLoading(false));
  }, [showtime]);

  if (!showtime) return null;

  // Toggle seat selection
  const handleSeatClick = (seat) => {
    if (seat.is_booked) return;

    const exists = selectedSeats.find((s) => s.id === seat.id);

    if (exists) {
      // Remove seat
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      // Add seat (auto replace if exceeded target)
      if (selectedSeats.length >= targetSeatCount) {
        setSelectedSeats([...selectedSeats.slice(1), seat]);
      } else {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  // Submit Booking handler
  const handleSubmitBooking = async () => {
    if (selectedSeats.length === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        showtime_id: showtime.id,
        user_name: userName.trim() || 'Pranay Ingale',
        user_email: userEmail.trim() || 'pranay@example.com',
        user_phone: userPhone.trim() || '+91 98765 43210',
        seats: selectedSeats.map((s) => s.id),
      };

      const result = await createBooking(payload);
      onSubmitSuccess(result);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to complete ticket booking.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate total price
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const getSeatsForRow = (rowLetter) => {
    if (!layoutData) return [];
    return layoutData.seats.filter((s) => s.row === rowLetter);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Fixed Header */}
        <div className="modal-header-fixed">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {layoutData?.hall_name || showtime.hall_name} Cineplex
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-semibold">
                {layoutData?.screen_name || showtime.screen_name}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {layoutData?.movie_title || 'Movie'}
            </h2>
            <p className="text-xs text-slate-400">
              {showtime.show_date} • {showtime.start_time} • {showtime.experience}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Header Submit Button */}
            {selectedSeats.length > 0 && (
              <button
                disabled={submitting}
                onClick={handleSubmitBooking}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Submit ({selectedSeats.length})</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Auditorium Body */}
        <div className="modal-scroll-body space-y-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading 60 luxury auditorium seats...
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Screen Graphic with Curved Glow */}
              <div className="cinema-screen-container">
                <div className="cinema-screen-curve" />
                <div className="cinema-screen-light" />
                <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mt-2">
                  All Eyes This Way • Cinema Screen 1
                </p>
              </div>

              {/* Seat Matrix */}
              <div className="max-w-2xl mx-auto space-y-6">
                {/* VIP Recliner Tier (Row A, B) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs px-2 text-slate-400 border-b border-white/5 pb-1">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      VIP Recliners — ₹{(showtime.base_price + 120).toFixed(0)}
                    </span>
                    <span className="text-[11px] text-slate-500">Rows A - B</span>
                  </div>

                  {['A', 'B'].map((rowLetter) => (
                    <div key={rowLetter} className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <span className="w-5 text-xs font-bold text-slate-400 text-center">
                        {rowLetter}
                      </span>

                      {/* Left Column (1-5) */}
                      <div className="flex gap-1.5 sm:gap-2">
                        {getSeatsForRow(rowLetter)
                          .slice(0, 5)
                          .map((seat) => {
                            const isSelected = selectedSeats.some((s) => s.id === seat.id);
                            return (
                              <button
                                key={seat.id}
                                disabled={seat.is_booked}
                                onClick={() => handleSeatClick(seat)}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                className={`seat-btn ${
                                  seat.is_booked
                                    ? 'booked'
                                    : isSelected
                                    ? 'selected'
                                    : 'available'
                                }`}
                                title={`${seat.id} (${seat.tier}) - ₹${seat.price}`}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                      </div>

                      {/* Center Aisle */}
                      <div className="w-4 sm:w-8" />

                      {/* Right Column (6-10) */}
                      <div className="flex gap-1.5 sm:gap-2">
                        {getSeatsForRow(rowLetter)
                          .slice(5, 10)
                          .map((seat) => {
                            const isSelected = selectedSeats.some((s) => s.id === seat.id);
                            return (
                              <button
                                key={seat.id}
                                disabled={seat.is_booked}
                                onClick={() => handleSeatClick(seat)}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                className={`seat-btn ${
                                  seat.is_booked
                                    ? 'booked'
                                    : isSelected
                                    ? 'selected'
                                    : 'available'
                                }`}
                                title={`${seat.id} (${seat.tier}) - ₹${seat.price}`}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                      </div>

                      <span className="w-5 text-xs font-bold text-slate-400 text-center">
                        {rowLetter}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Prime Executive Tier (Row C, D) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs px-2 text-slate-400 border-b border-white/5 pb-1">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      Prime Executive — ₹{(showtime.base_price + 50).toFixed(0)}
                    </span>
                    <span className="text-[11px] text-slate-500">Rows C - D</span>
                  </div>

                  {['C', 'D'].map((rowLetter) => (
                    <div key={rowLetter} className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <span className="w-5 text-xs font-bold text-slate-400 text-center">
                        {rowLetter}
                      </span>

                      {/* Left Column (1-5) */}
                      <div className="flex gap-1.5 sm:gap-2">
                        {getSeatsForRow(rowLetter)
                          .slice(0, 5)
                          .map((seat) => {
                            const isSelected = selectedSeats.some((s) => s.id === seat.id);
                            return (
                              <button
                                key={seat.id}
                                disabled={seat.is_booked}
                                onClick={() => handleSeatClick(seat)}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                className={`seat-btn ${
                                  seat.is_booked
                                    ? 'booked'
                                    : isSelected
                                    ? 'selected'
                                    : 'available'
                                }`}
                                title={`${seat.id} (${seat.tier}) - ₹${seat.price}`}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                      </div>

                      {/* Center Aisle */}
                      <div className="w-4 sm:w-8" />

                      {/* Right Column (6-10) */}
                      <div className="flex gap-1.5 sm:gap-2">
                        {getSeatsForRow(rowLetter)
                          .slice(5, 10)
                          .map((seat) => {
                            const isSelected = selectedSeats.some((s) => s.id === seat.id);
                            return (
                              <button
                                key={seat.id}
                                disabled={seat.is_booked}
                                onClick={() => handleSeatClick(seat)}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                className={`seat-btn ${
                                  seat.is_booked
                                    ? 'booked'
                                    : isSelected
                                    ? 'selected'
                                    : 'available'
                                }`}
                                title={`${seat.id} (${seat.tier}) - ₹${seat.price}`}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                      </div>

                      <span className="w-5 text-xs font-bold text-slate-400 text-center">
                        {rowLetter}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Classic Standard Tier (Row E, F) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs px-2 text-slate-400 border-b border-white/5 pb-1">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      Classic Standard — ₹{showtime.base_price.toFixed(0)}
                    </span>
                    <span className="text-[11px] text-slate-500">Rows E - F</span>
                  </div>

                  {['E', 'F'].map((rowLetter) => (
                    <div key={rowLetter} className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <span className="w-5 text-xs font-bold text-slate-400 text-center">
                        {rowLetter}
                      </span>

                      {/* Left Column (1-5) */}
                      <div className="flex gap-1.5 sm:gap-2">
                        {getSeatsForRow(rowLetter)
                          .slice(0, 5)
                          .map((seat) => {
                            const isSelected = selectedSeats.some((s) => s.id === seat.id);
                            return (
                              <button
                                key={seat.id}
                                disabled={seat.is_booked}
                                onClick={() => handleSeatClick(seat)}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                className={`seat-btn ${
                                  seat.is_booked
                                    ? 'booked'
                                    : isSelected
                                    ? 'selected'
                                    : 'available'
                                }`}
                                title={`${seat.id} (${seat.tier}) - ₹${seat.price}`}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                      </div>

                      {/* Center Aisle */}
                      <div className="w-4 sm:w-8" />

                      {/* Right Column (6-10) */}
                      <div className="flex gap-1.5 sm:gap-2">
                        {getSeatsForRow(rowLetter)
                          .slice(5, 10)
                          .map((seat) => {
                            const isSelected = selectedSeats.some((s) => s.id === seat.id);
                            return (
                              <button
                                key={seat.id}
                                disabled={seat.is_booked}
                                onClick={() => handleSeatClick(seat)}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                className={`seat-btn ${
                                  seat.is_booked
                                    ? 'booked'
                                    : isSelected
                                    ? 'selected'
                                    : 'available'
                                }`}
                                title={`${seat.id} (${seat.tier}) - ₹${seat.price}`}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                      </div>

                      <span className="w-5 text-xs font-bold text-slate-400 text-center">
                        {rowLetter}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend & Seat Info Indicator */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-white/20 bg-white/5" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-500 border border-emerald-400 text-[9px] text-slate-900 font-bold flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-white font-semibold">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-800 border border-white/5 opacity-60" />
                  <span>Sold Out</span>
                </div>

                {hoveredSeat && (
                  <div className="text-xs bg-indigo-950/80 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/40 font-semibold animate-fade-in">
                    {hoveredSeat.id} • {hoveredSeat.tier} • ₹{hoveredSeat.price}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Fixed Bottom Footer (ALWAYS VISIBLE WITH SUBMIT BUTTON) */}
        <div className="modal-footer-fixed">
          {/* Quick Patron Info (Toggleable/Editable) */}
          {showDetailsForm && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-900 border border-white/10 text-xs mb-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                  Selected Seats:
                </span>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {selectedSeats.length === 0 ? (
                    <span className="text-xs text-amber-400 font-semibold animate-pulse">
                      👈 Please click {targetSeatCount} seats above
                    </span>
                  ) : (
                    selectedSeats.map((s) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-0.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-black shadow-sm"
                      >
                        {s.id}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailsForm(!showDetailsForm)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline underline-offset-2 ml-2 whitespace-nowrap"
              >
                {showDetailsForm ? 'Hide Details' : 'Edit Guest Info'}
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
              <div>
                <span className="text-[11px] text-slate-400 block text-right">Total Price</span>
                <span className="text-xl font-black text-white">₹{totalPrice.toFixed(0)}</span>
              </div>

              {/* Explicit SUBMIT BUTTON */}
              <button
                disabled={selectedSeats.length === 0 || submitting}
                onClick={handleSubmitBooking}
                className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm shadow-2xl transition-all ${
                  selectedSeats.length > 0 && !submitting
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/40 hover:scale-105 active:scale-100 cursor-pointer ring-2 ring-emerald-300'
                    : 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10 opacity-70'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Booking Ticket...</span>
                  </>
                ) : selectedSeats.length === 0 ? (
                  <>
                    <Armchair className="w-4 h-4 text-slate-400" />
                    <span>Select Seats to Submit</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-slate-950" />
                    <span>
                      SUBMIT BOOKING ({selectedSeats.length}{' '}
                      {selectedSeats.length === 1 ? 'SEAT' : 'SEATS'})
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
