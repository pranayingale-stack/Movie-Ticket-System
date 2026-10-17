import React from 'react';
import { Building2, MapPin, Armchair, Tv, CheckCircle2 } from 'lucide-react';

export default function HallFilter({ halls, selectedHall, setSelectedHall }) {
  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Building2 className="w-4 h-4" />
            <span>Select Cinema Location</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Movie Halls (Oberoi & Infinity)</h2>
        </div>
        <p className="text-xs text-slate-400">
          Showing 2 premium multiplexes with minimum 50+ luxury recliner & executive seats per hall
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {halls.map((hall) => {
          const isSelected = selectedHall === hall.name;
          const isOberoi = hall.name === 'Oberoi';

          return (
            <div
              key={hall.id}
              onClick={() => setSelectedHall(isSelected ? 'all' : hall.name)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-950/80 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/20 ring-1 ring-indigo-500'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900/90'
              }`}
            >
              {/* Glow accent */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20 ${
                  isOberoi ? 'bg-amber-400' : 'bg-cyan-400'
                }`}
              />

              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        isOberoi
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {hall.name} Mall
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Tv className="w-3.5 h-3.5 text-indigo-400" />
                      {hall.screen_name}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {hall.display_name}
                  </h3>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {hall.location}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-xs text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                    <Armchair className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-white">{hall.total_seats}</span>
                    <span className="text-[11px] text-slate-400">Seats</span>
                  </div>
                  {isSelected && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-indigo-400 justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
