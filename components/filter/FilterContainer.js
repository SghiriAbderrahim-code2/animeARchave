'use client';

import React from 'react';
import { useId } from 'react';
import Filter from './Filter';
import { useSearch } from '@/stores/store';
import { useShow } from '@/stores/store';
import {
  Types,
  Status,
  Ratings,
  Producers,
  Genres,
  Themes,
  Demographics,
} from '../jsons';

export default function FilterContainer() {
  const setReLoad = useSearch((state) => state.setReLoad);
  const show = useShow((state) => state.filterShow);
  const setFilterShow = useShow((state) => state.setFilterShow);
  const setType = useSearch((state) => state.setType);
  const selectedType = useSearch((state) => state.type);
  const types = Types;
  const setStatu = useSearch((state) => state.setStatu);
  const selectedStatu = useSearch((state) => state.statu);
  const status = Status;
  const setRating = useSearch((state) => state.setRating);
  const selectedRating = useSearch((state) => state.rating);
  const ratings = Ratings;
  const setProducer = useSearch((state) => state.setProducer);
  const selectedProducers = useSearch((state) => state.producers);
  // نسخة قبل الفرز حتى لا يتم تطعير مصفوفة JSON المستوردة
  const producers = [...Producers].sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  const setGenre = useSearch((state) => state.setGenre);
  const selectedGenres = useSearch((state) => state.genres);
  const genres = Genres;
  const themes = Themes;
  const demographics = Demographics;
  const filterId = useId();
  const filters = [
    {
      selected: selectedType,
      name: 'Type',
      options: types,
      multi: false,
      func: (value) => {
        setType(value);
      },
    },
    {
      selected: selectedStatu,
      name: 'Statu',
      options: status,
      multi: false,
      func: (value) => {
        setStatu(value);
      },
    },
    {
      selected: selectedRating,
      name: 'Rating',
      options: ratings,
      multi: false,
      func: (value) => {
        setRating(value);
      },
    },
    {
      selected: selectedProducers,
      name: 'Producer',
      options: producers,
      multi: true,
      func: (value) => {
        let val = [];
        for (const key in selectedProducers) {
          val.push(selectedProducers[key]);
        }
        if (val.includes(value)) {
          val.splice(val.indexOf(value), 1);
        } else {
          val.push(value);
        }
        setProducer(val);
      },
    },
    {
      selected: selectedGenres,
      name: 'Genre',
      options: genres,
      multi: true,
      func: (value) => {
        let val = [];
        for (const key in selectedGenres) {
          val.push(selectedGenres[key]);
        }
        if (val.includes(value)) {
          val.splice(val.indexOf(value), 1);
        } else {
          val.push(value);
        }
        setGenre(val);
      },
    },
    {
      selected: selectedGenres,
      name: 'Theme',
      options: themes,
      multi: true,
      func: (value) => {
        let val = [];
        for (const key in selectedGenres) {
          val.push(selectedGenres[key]);
        }
        if (val.includes(value)) {
          val.splice(val.indexOf(value), 1);
        } else {
          val.push(value);
        }
        setGenre(val);
      },
    },
    {
      selected: selectedGenres,
      name: 'Demographics',
      options: demographics,
      multi: true,
      func: (value) => {
        let val = [];
        for (const key in selectedGenres) {
          val.push(selectedGenres[key]);
        }
        if (val.includes(value)) {
          val.splice(val.indexOf(value), 1);
        } else {
          val.push(value);
        }
        setGenre(val);
      },
    },
  ];
  if (!show) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby={`filter-title-${filterId}`}
      onClick={() => setFilterShow(false)}
      className="fixed top-0 left-0 w-full h-full z-50"
    >
      <div
        className="grid place-items-center fixed inset-0 bg-black/70 backdrop-blur-sm"
      >
        <div className=" grid grid-rows-6 bg-[var(--bg)] w-3/4 max-w-[550px] h-4/5 max-h-[30rem] rounded-md border-2 border-[var(--gr2)] shadow-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex justify-between items-center w-full py-3 px-6 fill-[var(--theme-color)]">
          <p id={`filter-title-${filterId}`} className="font-bold text-xl">Filter :</p>
          <button
            type="button"
            onClick={() => setFilterShow(false)}
            className="p-2 rounded hover:bg-[var(--bg)] hover:text-[var(--theme-color)]"
            aria-label="Close filter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-auto row-span-5 flex flex-col gap-4">
          {filters.map((item) => {
            return (
              <Filter
                key={item.name}
                selected={item.selected}
                name={item.name}
                options={item.options}
                multi={item.multi}
                func={item.func}
              />
            );
          })}
        </div>

        <div className=" w-full py-3 pr-4 flex justify-end">
          <button
            onClick={() => {
              setReLoad();
              setFilterShow(false);
            }}
            className="font-bold hover:bg-[var(--bg)] text-[var(--theme-color)] py-1 px-3 rounded-full "
          >
            Ok
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}