const API_BASE = '/api/v1/cinema';

export async function fetchHalls() {
  const res = await fetch(`${API_BASE}/halls`);
  if (!res.ok) throw new Error('Failed to fetch halls');
  return res.json();
}

export async function fetchMovies(hallName = null, genre = null, search = null) {
  const params = new URLSearchParams();
  if (hallName && hallName !== 'all') params.append('hall_name', hallName);
  if (genre && genre !== 'all') params.append('genre', genre);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/movies?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
}

export async function fetchMovie(movieId) {
  const res = await fetch(`${API_BASE}/movies/${movieId}`);
  if (!res.ok) throw new Error('Failed to fetch movie');
  return res.json();
}

export async function fetchShowtimes(movieId = null, hallName = null, showDate = null) {
  const params = new URLSearchParams();
  if (movieId) params.append('movie_id', movieId);
  if (hallName && hallName !== 'all') params.append('hall_name', hallName);
  if (showDate) params.append('show_date', showDate);

  const res = await fetch(`${API_BASE}/showtimes?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch showtimes');
  return res.json();
}

export async function fetchShowtimeSeats(showtimeId) {
  const res = await fetch(`${API_BASE}/showtimes/${showtimeId}/seats`);
  if (!res.ok) throw new Error('Failed to fetch seats layout');
  return res.json();
}

export async function createBooking(bookingData) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to complete booking');
  }
  return res.json();
}

export async function fetchBookings(email = null) {
  const url = email ? `${API_BASE}/bookings?email=${encodeURIComponent(email)}` : `${API_BASE}/bookings`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function cancelBooking(bookingId) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
    method: 'POST',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to cancel booking');
  }
  return res.json();
}
