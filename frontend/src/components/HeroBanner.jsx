import React from 'react';
import { Star, Clock, Ticket, Sparkles, Volume2, ShieldCheck } from 'lucide-react';

export default function HeroBanner({ featuredMovie, onBookNow }) {
  if (!featuredMovie) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl lg:rounded-3xl border border-white/10 mb-10 shadow-2xl">
      {/* Background with dark gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={featuredMovie.backdrop_url}
          alt={featuredMovie.title}
          className="w-full h-full object-cover object-center filter brightness-50 contrast-125 transform scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>NOW SCREENING IN OBEROI & INFINITY</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
            {featuredMovie.title}
          </h1>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/30 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {featuredMovie.imdb_rating} IMDb
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {featuredMovie.duration_mins} mins
            </span>
            <span className="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-500/30 font-semibold">
              {featuredMovie.rating}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              {featuredMovie.language}
            </span>
          </div>

          <p className="text-sm md:text-base text-slate-300/90 leading-relaxed line-clamp-3 max-w-xl">
            {featuredMovie.description}
          </p>

          {/* Call to action */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onBookNow(featuredMovie)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Seats Now</span>
            </button>

            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Instant Confirmation • Minimum 50+ Luxury Seats</span>
            </div>
          </div>
        </div>

        {/* Poster Showcase preview */}
        <div className="hidden lg:block relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-40 blur-lg group-hover:opacity-75 transition duration-500" />
          <div className="relative w-52 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <img
              src={featuredMovie.poster_url}
              alt={featuredMovie.title}
              className="w-full h-72 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
