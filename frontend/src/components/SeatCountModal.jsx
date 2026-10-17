import React, { useState } from 'react';
import { X, Users, Sparkles, ArrowRight, Armchair } from 'lucide-react';

export default function SeatCountModal({ showtime, onClose, onProceed }) {
  const [seatCount, setSeatCount] = useState(2);

  if (!showtime) return null;

  const countOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>STEP 1 OF 2</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">How Many Seats?</h2>
          <p className="text-xs text-slate-400">
            {showtime.hall_name} Mall ({showtime.screen_name}) • {showtime.start_time}
          </p>
        </div>

        {/* Seat Count Selector (1 to 8) */}
        <div className="grid grid-cols-4 gap-2.5 py-2">
          {countOptions.map((num) => {
            const isSelected = seatCount === num;
            return (
              <button
                key={num}
                onClick={() => setSeatCount(num)}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-105 ring-2 ring-indigo-400'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-white/5 hover:border-white/20'
                }`}
              >
                <span className="text-lg font-black">{num}</span>
                <span className="text-[10px] uppercase font-semibold text-slate-400 group-hover:text-slate-200">
                  {num === 1 ? 'Seat' : 'Seats'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Seat Tier Pricing Overview */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 space-y-2.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Ticket Price Categories
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="font-semibold text-slate-200">VIP Recliner (Row A-B)</span>
            </div>
            <span className="font-extrabold text-amber-400">₹{(showtime.base_price + 120).toFixed(0)}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span className="font-semibold text-slate-200">Prime Executive (Row C-D)</span>
            </div>
            <span className="font-extrabold text-indigo-300">₹{(showtime.base_price + 50).toFixed(0)}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="font-semibold text-slate-200">Classic Standard (Row E-F)</span>
            </div>
            <span className="font-extrabold text-slate-300">₹{showtime.base_price.toFixed(0)}</span>
          </div>
        </div>

        {/* Proceed CTA */}
        <button
          onClick={() => onProceed(seatCount)}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-100"
        >
          <span>Select {seatCount} {seatCount === 1 ? 'Seat' : 'Seats'} on Auditorium Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
