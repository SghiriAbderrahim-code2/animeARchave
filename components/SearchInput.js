'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function SearchInput({ search }) {
  const [value, setValue] = useState('');
  const [recent, setRecent] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      if (Array.isArray(saved)) setRecent(saved);
    } catch { /* ignore corrupt storage */ }
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleInput = (e) => {
    const v = e.target.value;
    setValue(v);
    search(v);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(0, 5);
    setRecent(next);
    localStorage.setItem('recentSearches', JSON.stringify(next));
    setShowRecent(false);
    search(trimmed);
  };

  const handleClear = () => {
    setValue('');
    search('');
    setShowRecent(false);
  };

  const pickRecent = (term) => {
    setValue(term);
    search(term);
    setShowRecent(false);
  };

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem('recentSearches');
    setShowRecent(false);
  };

  return (
    <div ref={containerRef} className="relative my-1 flex justify-center w-full gap-2">
      <form onSubmit={handleSubmit} className="relative w-3/4 flex items-center">
        <input
          onInput={handleInput}
          onFocus={() => setShowRecent(true)}
          id="inSearch"
          className="outline-none text-[var(--tx)] text-sm font-bold w-full px-9 py-1 border-2 bg-[var(--gr2)] focus:bg-[var(--bg)] rounded-full border-[var(--gr2)] focus:border-[var(--theme-color)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-color)]"
          type="search"
          placeholder="Search for anime..."
          value={value}
          aria-label="Search for anime"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 text-[var(--gr3)] hover:text-[var(--tx)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--theme-color)] rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {showRecent && recent.length > 0 && (
        <div className="absolute top-full mt-1 w-3/4 bg-[var(--bg)] border border-[var(--gr2)] rounded-lg shadow-xl z-40 overflow-hidden">
          <div className="flex justify-between items-center px-3 py-1.5 border-b border-[var(--gr2)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gr3)]">Recent searches</span>
            <button
              type="button"
              onClick={clearRecent}
              className="text-[10px] font-bold text-[var(--theme-color)] hover:underline"
            >
              Clear
            </button>
          </div>
          {recent.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => pickRecent(term)}
              className="block w-full text-left px-3 py-1.5 text-sm font-semibold text-[var(--tx)] hover:bg-[var(--gr)] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 inline mr-2 text-[var(--gr3)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}