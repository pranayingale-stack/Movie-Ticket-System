import React from 'react';
import { X, CheckCircle, Ticket, MapPin, Tv, Calendar, Clock, Armchair, Printer, QrCode } from 'lucide-react';

export default function DigitalTicketModal({ booking, onClose }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-transparent flex flex-col items-center">
        {/* Close Button top right */}
        <button
          onClick={onClose}
          className="self-end mb-2 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Boarding Pass Ticket */}
        <div className="ticket-wrapper w-full p-6 text-white space-y-5">
          {/* Decorative notches */}
          <div className="ticket-notch-left" />
          <div className="ticket-notch-right" />
          <div className="ticket-divider-line" />

          {/* Ticket Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest text-indigo-400 uppercase">
                <Ticket className="w-3.5 h-3.5" />
                <span>CONFIRMED MOVIE PASS</span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-white mt-0.5">
                {booking.hall_name} Cineplex
              </h2>
              <p className="text-[11px] text-slate-400">{booking.screen_name}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Booking ID</span>
              <span className="text-xs font-mono font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {booking.booking_code}
              </span>
            </div>
          </div>

          {/* Movie Details */}
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Movie</span>
              <h3 className="text-xl font-extrabold text-white tracking-tight">{booking.movie_title}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-400" /> Date
                </span>
                <span className="text-xs font-bold text-slate-200">{booking.show_date}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase block flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-400" /> Time
                </span>
                <span className="text-xs font-bold text-slate-200">{booking.start_time}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase block flex items-center gap-1">
                  <Armchair className="w-3 h-3 text-emerald-400" /> Seats ({booking.tickets_count})
                </span>
                <span className="text-sm font-black text-emerald-400">
                  {booking.seats.join(', ')}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Total Paid</span>
                <span className="text-sm font-black text-white">₹{booking.total_price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Guest Name */}
          <div className="text-xs text-slate-300 pt-1">
            <span className="text-[10px] text-slate-400 uppercase block">Ticket Holder</span>
            <span className="font-semibold text-white">{booking.user_name}</span> •{' '}
            <span className="text-slate-400">{booking.user_email}</span>
          </div>

          {/* Bottom Stub (After Notches) */}
          <div className="pt-8 flex items-center justify-between">
            {/* Simulated QR Code */}
            <div className="p-2 bg-white rounded-xl shadow-md shrink-0">
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="black">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 3h2v3h-2v-3zm0-5h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 6h2v2h-2v-2zm2-2h2v2h-2v-2z" />
              </svg>
            </div>

            {/* Barcode & Status */}
            <div className="flex-1 pl-4 text-right space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                <CheckCircle className="w-3 h-3" />
                <span>CONFIRMED & READY</span>
              </div>
              <p className="text-[10px] text-slate-400">Scan at Cinema Entrance Screen 1</p>
              {/* Simulated barcode stripes */}
              <div className="h-6 flex items-center justify-end gap-0.5 pt-1 opacity-70">
                {[4, 2, 6, 3, 5, 2, 4, 7, 2, 5, 3, 6, 2, 4, 3, 5].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-slate-300 rounded-sm"
                    style={{ height: `${h * 3}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4 w-full">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ticket</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
