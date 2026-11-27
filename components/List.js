import React from 'react';
import AnimeContainer from './AnimeContainer';
import SkeletonCard from './SkeletonCard';
import { useSearch } from '@/stores/store';

export default function List() {
  const animeData = useSearch((state) => state.animeData);
  const search = useSearch((state) => state.search);
  
  if (Array.isArray(animeData) && animeData.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center px-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-[var(--gr3)] mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <p className="text-lg font-semibold text-[var(--tx)]">No anime found</p>
        <p className="text-sm text-[var(--gr3)] mt-1">Try adjusting your search or filters to find what you&apos;re looking for.</p>
      </div>
    );
  }

  return (
    <div className=" overflow-hidden w-fill grid lg:grid-cols-6 sm:grid-cols-4 grid-cols-2 gap-2 p-3">
      {animeData.map((item, i) => (
        <AnimeContainer key={item.mal_id ?? i} anime={item} />
      ))}
    </div>
  );
}
