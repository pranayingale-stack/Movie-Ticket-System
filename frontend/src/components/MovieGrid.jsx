import React, { useState } from 'react';
import MovieCard from './MovieCard';
import { Film, Filter } from 'lucide-react';

export default function MovieGrid({ movies, onSelectMovie, selectedHall }) {
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Extract unique genres
  const genres = ['All', 'Sci-Fi', 'Action', 'Drama', 'Animation'];

  const filteredMovies = movies.filter((movie) => {
    if (selectedGenre === 'All') return true;
    return movie.genre.toLowerCase().includes(selectedGenre.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header & Genre Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Film className="w-4 h-4" />
            <span>Now Showing In Cinemas</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Trending Movies</h2>
        </div>

        {/* Genre pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === g
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5 hover:border-white/10'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-white/5">
          <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">No movies match your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelectMovie={onSelectMovie}
              selectedHall={selectedHall}
            />
          ))}
        </div>
      )}
    </div>
  );
}
