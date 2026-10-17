import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, User, Mail, Phone, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { createBooking } from '../api';

export default function CheckoutModal({
  showtime,
  selectedSeats,
  totalTicketPrice,
  onClose,
  onBack,
  onBookingSuccess,
}) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!showtime || !selectedSeats.length) return null;

  const convenienceFee = selectedSeats.length * 20;
  const gst = convenienceFee * 0.18;
  const grandTotal = totalTicketPrice + convenienceFee + gst;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !userPhone.trim()) {
      setErrorMessage('Please fill in all contact details.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        showtime_id: showtime.id,
        user_name: userName.trim(),
        user_email: userEmail.trim(),
        user_phone: userPhone.trim(),
        seats: selectedSeats.map((s) => s.id),
      };

      const result = await createBooking(payload);
      onBookingSuccess(result);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all mr-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white">Review & Checkout</h2>
              <p className="text-xs text-slate-400">
                {showtime.hall_name} Mall ({showtime.screen_name})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Booking Summary Box */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  {showtime.experience}
                </span>
                <h3 className="text-base font-extrabold text-white">{showtime.movie_title || 'Movie'}</h3>
                <p className="text-xs text-slate-400">
                  {showtime.show_date} • {showtime.start_time}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Seats ({selectedSeats.length})</span>
                <span className="text-sm font-extrabold text-emerald-400">
                  {selectedSeats.map((s) => s.id).join(', ')}
                </span>
              </div>
            </div>

            {/* Price lines */}
            <div className="border-t border-white/5 pt-2.5 space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Tickets Subtotal</span>
                <span>₹{totalTicketPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Convenience Fee</span>
                <span>₹{convenienceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Integrated GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-white text-sm">
                <span>Total Amount</span>
                <span className="text-emerald-400 text-base">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Guest Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contact & Ticket Details
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Email Address (Ticket will be sent here)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="e.g. aarav@example.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="e.g. +91 98201 12345"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Ticket Reservation...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>Confirm & Pay ₹{grandTotal.toFixed(2)}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
