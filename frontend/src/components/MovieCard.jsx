import React from 'react';
import { Star, Clock, Ticket, Sparkles } from 'lucide-react';

export default function MovieCard({ movie, onSelectMovie, selectedHall }) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-slate-900/60 border border-white/10 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all duration-300 flex flex-col hover:-translate-y-1.5 shadow-lg hover:shadow-indigo-500/10">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md text-amber-400 px-2 py-1 rounded-lg border border-amber-500/30 text-xs font-bold shadow-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{movie.imdb_rating}</span>
        </div>

        {/* Hall tag */}
        <div className="absolute top-3 left-3 bg-indigo-950/80 backdrop-blur-md text-indigo-300 px-2 py-1 rounded-lg border border-indigo-500/30 text-[10px] font-semibold uppercase tracking-wider">
          {selectedHall === 'all' ? 'Oberoi • Infinity' : `${selectedHall} Mall`}
        </div>

        {/* Certification badge bottom left */}
        <div className="absolute bottom-3 left-3 text-[11px] font-bold text-slate-300 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
          {movie.rating}
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider line-clamp-1 mb-1">
            {movie.genre}
          </div>
          <h3 className="text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-indigo-300 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {movie.duration_mins}m
            </span>
            <span>•</span>
            <span className="line-clamp-1">{movie.language}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelectMovie(movie)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-600 text-xs font-bold transition-all shadow-sm"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Book Showtimes</span>
        </button>
      </div>
    </div>
  );
}
