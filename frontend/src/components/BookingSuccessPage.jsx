import React from 'react';
import {
  CheckCircle,
  Ticket,
  MapPin,
  Tv,
  Calendar,
  Clock,
  Armchair,
  Printer,
  ArrowLeft,
  Share2,
  Film,
  Sparkles,
  Download,
} from 'lucide-react';

export default function BookingSuccessPage({
  booking,
  movie,
  onBookAnotherMovie,
  onOpenMyBookings,
}) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const isOberoi = booking.hall_name === 'Oberoi';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in space-y-8">
      {/* Success Notification Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-2xl relative overflow-hidden">
        {/* Glow decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/20 mx-auto">
          <CheckCircle className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>BOOKING CONFIRMED & ISSUED</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            You Booked Your Ticket Successfully!
          </h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Your movie tickets are confirmed. Please present the digital ticket or QR code at the cinema entrance of {booking.hall_name} Mall.
          </p>
        </div>
      </div>

      {/* Main Digital Ticket Pass (Boarding Pass Card) */}
      <div className="ticket-wrapper p-6 sm:p-8 space-y-6">
        {/* Decorative Notches & Tear Line */}
        <div className="ticket-notch-left" />
        <div className="ticket-notch-right" />
        <div className="ticket-divider-line" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold tracking-widest text-indigo-400 uppercase">
                LUMIÈRE CINEMAS PASS
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {booking.hall_name} Cineplex
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-indigo-400" />
                <span>{booking.screen_name}</span>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-white/5 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-white/5 sm:border-none">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Booking ID
            </span>
            <span className="text-base sm:text-lg font-mono font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/30 inline-block mt-0.5">
              {booking.booking_code}
            </span>
          </div>
        </div>

        {/* Prominent Seat Numbers Callout Banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900/90 to-indigo-950/60 rounded-2xl p-4 sm:p-5 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <Armchair className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-extrabold tracking-wider text-emerald-400 block">
                Allocated Seat Numbers
              </span>
              <span className="text-xs text-slate-300">
                Total Tickets: {booking.tickets_count} {booking.tickets_count === 1 ? 'Seat' : 'Seats'}
              </span>
            </div>
          </div>

          {/* Seat Badges */}
          <div className="flex flex-wrap gap-2">
            {booking.seats.map((seatId) => (
              <span
                key={seatId}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-base tracking-wide shadow-lg shadow-emerald-500/30 border border-emerald-300"
              >
                Seat {seatId}
              </span>
            ))}
          </div>
        </div>

        {/* Movie Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Movie Poster */}
          {movie && (
            <div className="hidden md:block rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-slate-950 aspect-[2/3] max-h-56">
              <img
                src={movie.poster_url}
                alt={booking.movie_title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Full Details */}
          <div className={movie ? 'md:col-span-2 space-y-4' : 'md:col-span-3 space-y-4'}>
            <div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                Movie Name
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {booking.movie_title}
              </h3>
              {movie && (
                <p className="text-xs text-slate-400 mt-1">
                  {movie.genre} • {movie.duration_mins}m • {movie.rating} • {movie.language}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3.5 bg-slate-950/60 rounded-2xl p-4 border border-white/5">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Show Date
                </span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  {booking.show_date}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Show Time
                </span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  {booking.start_time}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Cinema Hall
                </span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  {booking.hall_name} Mall
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Auditorium Screen
                </span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  Screen 1 (Audi 1)
                </span>
              </div>
            </div>

            {/* Guest / Pricing Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white/5 rounded-xl p-3 border border-white/5">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Ticket Holder</span>
                <span className="font-semibold text-white">{booking.user_name}</span> •{' '}
                <span className="text-slate-400">{booking.user_email}</span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Total Amount Paid</span>
                <span className="text-base font-black text-emerald-400">
                  ₹{booking.total_price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stub: Fake QR Code & Entry Validation */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Fake Realistic QR Code */}
          <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl shadow-xl shrink-0">
            <svg
              className="w-24 h-24 sm:w-28 sm:h-28 text-slate-950"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              {/* Outer Top-Left Finder */}
              <rect x="5" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
              <rect x="12" y="12" width="12" height="12" rx="2" />

              {/* Outer Top-Right Finder */}
              <rect x="69" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
              <rect x="76" y="12" width="12" height="12" rx="2" />

              {/* Outer Bottom-Left Finder */}
              <rect x="5" y="69" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
              <rect x="12" y="76" width="12" height="12" rx="2" />

              {/* Data Blocks Matrix */}
              <rect x="36" y="8" width="5" height="5" />
              <rect x="46" y="8" width="5" height="5" />
              <rect x="56" y="8" width="5" height="5" />
              <rect x="36" y="18" width="5" height="5" />
              <rect x="46" y="18" width="5" height="5" />
              <rect x="36" y="28" width="5" height="5" />
              <rect x="56" y="28" width="5" height="5" />

              <rect x="8" y="38" width="5" height="5" />
              <rect x="18" y="38" width="5" height="5" />
              <rect x="28" y="38" width="5" height="5" />
              <rect x="38" y="38" width="5" height="5" />
              <rect x="48" y="38" width="5" height="5" />
              <rect x="58" y="38" width="5" height="5" />
              <rect x="68" y="38" width="5" height="5" />
              <rect x="78" y="38" width="5" height="5" />
              <rect x="88" y="38" width="5" height="5" />

              <rect x="8" y="48" width="5" height="5" />
              <rect x="28" y="48" width="5" height="5" />
              <rect x="38" y="48" width="5" height="5" />
              <rect x="68" y="48" width="5" height="5" />
              <rect x="88" y="48" width="5" height="5" />

              <rect x="18" y="58" width="5" height="5" />
              <rect x="38" y="58" width="5" height="5" />
              <rect x="48" y="58" width="5" height="5" />
              <rect x="58" y="58" width="5" height="5" />
              <rect x="78" y="58" width="5" height="5" />

              <rect x="36" y="68" width="5" height="5" />
              <rect x="46" y="68" width="5" height="5" />
              <rect x="56" y="68" width="5" height="5" />
              <rect x="68" y="68" width="5" height="5" />
              <rect x="78" y="68" width="5" height="5" />
              <rect x="88" y="68" width="5" height="5" />

              <rect x="36" y="78" width="5" height="5" />
              <rect x="56" y="78" width="5" height="5" />
              <rect x="68" y="78" width="5" height="5" />
              <rect x="88" y="78" width="5" height="5" />

              <rect x="36" y="88" width="5" height="5" />
              <rect x="46" y="88" width="5" height="5" />
              <rect x="68" y="88" width="5" height="5" />
              <rect x="78" y="88" width="5" height="5" />
            </svg>

            <div className="text-slate-900 text-left space-y-0.5 pr-2">
              <span className="text-[10px] font-black uppercase tracking-wider block text-indigo-700">
                Gate Entry Pass
              </span>
              <span className="text-xs font-mono font-bold block text-slate-800">
                {booking.booking_code}
              </span>
              <span className="text-[9px] text-slate-500 block leading-tight">
                Scan barcode or QR at Screen 1 turnstile
              </span>
            </div>
          </div>

          {/* Barcode & Security text */}
          <div className="flex-1 w-full text-right space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>OFFICIAL DIGITAL CINEMA PASS</span>
            </div>
            <p className="text-xs text-slate-400">
              Valid for {booking.hall_name} Mall • Screen 1 • Seats: {booking.seats.join(', ')}
            </p>

            {/* Graphic Barcode Stripes */}
            <div className="h-8 flex items-center justify-end gap-0.5 pt-1 opacity-80">
              {[5, 2, 7, 3, 6, 2, 8, 3, 4, 7, 2, 6, 4, 7, 3, 5, 2, 6, 4, 8, 3, 5].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-slate-200 rounded-sm"
                  style={{ height: `${h * 3.2}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={onBookAnotherMovie}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 font-bold text-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Book Another Movie</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMyBookings}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 font-bold text-xs transition-all"
          >
            <Ticket className="w-4 h-4" />
            <span>My Bookings</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-100"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
}
