'use client';

import React from 'react';
import { useSearch } from '@/stores/store';
import { Genres, Themes, Demographics, Producers } from './jsons';

const allGenreOptions = [...Genres, ...Themes, ...Demographics];

export default function FilterChips() {
  const type = useSearch((state) => state.type);
  const statu = useSearch((state) => state.statu);
  const rating = useSearch((state) => state.rating);
  const producers = useSearch((state) => state.producers);
  const genres = useSearch((state) => state.genres);
  const setType = useSearch((state) => state.setType);
  const setStatu = useSearch((state) => state.setStatu);
  const setRating = useSearch((state) => state.setRating);
  const setProducer = useSearch((state) => state.setProducer);
  const setGenre = useSearch((state) => state.setGenre);
  const setReLoad = useSearch((state) => state.setReLoad);

  const typeLabels = {
    tv: 'TV', movie: 'Movie', ova: 'OVA', special: 'Special',
    ona: 'ONA', music: 'Music', cm: 'CM', pv: 'PV', tv_special: 'TV Special',
  };
  const statusLabels = {
    airing: 'Airing', complete: 'Complete', upcoming: 'Upcoming',
  };
  const ratingLabels = {
    g: 'G', pg: 'PG', pg13: 'PG-13', r17: 'R-17+', r: 'R', rx: 'Rx',
  };

  const getGenreName = (id) => {
    const found = allGenreOptions.find((g) => g.mal_id === id);
    return found ? found.name : `#${id}`;
  };
  const getProducerName = (id) => {
    const found = Producers.find((p) => p.mal_id === id);
    return found ? found.name : `#${id}`;
  };

  const chips = [];
  if (type) chips.push({ key: 'type', label: typeLabels[type] || type, onRemove: () => setType('') });
  if (statu) chips.push({ key: 'statu', label: statusLabels[statu] || statu, onRemove: () => setStatu('') });
  if (rating) chips.push({ key: 'rating', label: ratingLabels[rating] || rating, onRemove: () => setRating('') });
  producers.forEach((id) => {
    chips.push({ key: `prod-${id}`, label: getProducerName(id), onRemove: () => setProducer(producers.filter((p) => p !== id)) });
  });
  genres.forEach((id) => {
    chips.push({ key: `genre-${id}`, label: getGenreName(id), onRemove: () => setGenre(genres.filter((g) => g !== id)) });
  });

  if (chips.length === 0) return null;

  const handleRemove = (chip) => {
    chip.onRemove();
    setReLoad();
  };

  const handleClearAll = () => {
    setType('');
    setStatu('');
    setRating('');
    setProducer([]);
    setGenre([]);
    setReLoad();
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-3 py-2" role="list" aria-label="Active filters">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          role="listitem"
          onClick={() => handleRemove(chip)}
          className="group inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-[var(--gr)] text-[var(--tx)] hover:bg-[var(--theme-color)] hover:text-[var(--bg)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-color)]"
          aria-label={`Remove filter ${chip.label}`}
        >
          {chip.label}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}
      <button
        type="button"
        onClick={handleClearAll}
        className="px-3 py-1 text-xs font-bold rounded-full text-[var(--theme-color)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-color)]"
      >
        Clear all
      </button>
    </div>
  );
}