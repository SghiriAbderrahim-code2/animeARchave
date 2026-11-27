'use client';

import React from 'react';
import SortChoose from './SortChoose';
import { useShow, useSearch } from '@/stores/store';
import { SortUp, SortDown } from '../svgs';

export default function SortContainer() {
  const show = useShow((state) => state.sortShow);
  const setSortShow = useShow((state) => state.setSortShow);
  const setSortDirectionDraft = useSearch((state) => state.setSortDirectionDraft);
  const sortDirectionDraft = useSearch((state) => state.sortDirectionDraft);
  const applySortDraft = useSearch((state) => state.applySortDraft);
  const cancelSortDraft = useSearch((state) => state.cancelSortDraft);
  const setReLoad = useSearch((state) => state.setReLoad);

  if (!show) return null;

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="sort-title"
      onClick={() => {
        cancelSortDraft();
        setSortShow(false);
      }}
      className="grid place-items-center fixed backdrop-opacity-10 backdrop-invert bg-black/90 top-0 left-0 w-screen h-screen z-50"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="border-2 border-[var(--gr2)] grid bg-[var(--bg)] w-3/4 max-w-[550px] h-4/5 rounded-md shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center w-full py-3 px-6 fill-[var(--theme-color)] border-b border-[var(--gr2)]">
          <p id="sort-title" className="font-bold text-xl">Sort by :</p>
          <button 
            type="button"
            onClick={() => setSortDirectionDraft()} 
            className="text-2xl hover:bg-[var(--gr)] p-2 rounded-full cursor-pointer transition-colors"
            aria-label="Toggle sort direction"
          >
            {sortDirectionDraft ? <SortUp /> : <SortDown />}
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex flex-col gap-3">
          <SortChoose chooseName="Start date" value="start_date"/>
          <SortChoose chooseName="End date" value="end_date"/>
          <SortChoose chooseName="Episodes" value="episodes"/>
          <SortChoose chooseName="Score" value="score"/>
          <SortChoose chooseName="Rank" value="rank"/>
          <SortChoose chooseName="Popularity" value="popularity"/>
          <SortChoose chooseName="Favorites" value="favorites"/>
          <SortChoose chooseName="Title" value="title"/>
        </div>

        <div className="w-full py-4 px-6 flex justify-between border-t border-[var(--gr2)] bg-[var(--bg)]">
          <button 
            type="button"
            onClick={() => {
              cancelSortDraft();
              setSortShow(false);
            }} 
            className="font-bold hover:bg-[var(--gr2)] text-[var(--gr3)] hover:text-[var(--tx)] px-4 py-2 rounded transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={() => {
              applySortDraft();
              setReLoad();
              setSortShow(false);
            }} 
            className="font-bold bg-[var(--theme-color)] text-[var(--bg)] hover:opacity-90 px-6 py-2 rounded transition-opacity"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
