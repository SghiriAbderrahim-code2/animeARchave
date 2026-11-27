'use client';

import React from 'react';
import { useSearch } from '@/stores/store';

export default function SortChoose({ chooseName, value }) {
  const setSortValue = useSearch((state) => state.setSortValue);
  const sort = useSearch((state) => state.sort);
  const sortDraft = useSearch((state) => state.sortDraft);
  const setSortDraft = useSearch((state) => state.setSortDraft);
  const setSortDirectionDraft = useSearch((state) => state.setSortDirectionDraft);

  return (
    <label className=" checked:text-[var(--theme-color)] lg:hover:bg-[var(--gr)] grid grid-cols-3 w-full gap-14 place-items-center">
      <input
        onChange={() => {
          setSortDraft(value);
        }}
        className=" peer appearance-none checked:bg-[var(--theme-color)] h-4 w-4 rounded-full border-[var(--bg)] border-4 checked:outline-[var(--theme-color)] outline outline-2"
        type="radio"
        name="choose"
        checked={value === sortDraft ? true : false}
      />
      <p className=" peer-checked:text-[var(--theme-color)] justify-self-start col-span-2 font-semibold ">
        {chooseName}
      </p>
    </label>
  );
}
