'use client';

import React, { useState } from 'react';

import { usePathname } from 'next/navigation';
import AnimeDetails from '../../../components/anime/AnimeDetails';
import AnimeCharacters from '../../../components/anime/AnimeCharacters';
import AnimePictures from '../../../components/anime/AnimePictures';

const conteners = [
  { name: 'Details', div: <AnimeDetails /> },
  { name: 'Characters', div: <AnimeCharacters /> },
  { name: 'Pictures', div: <AnimePictures /> },
];

export default function Page() {
  const path = usePathname();
  const id = path.split('/')[2];
  const [active, setActive] = useState('Details');

  const sections = [
    { name: 'Details', div: <AnimeDetails id={id} /> },
    { name: 'Characters', div: <AnimeCharacters id={id} /> },
    { name: 'Pictures', div: <AnimePictures id={id} /> },
  ];

  return (
    <div className="w-screen h-screen overflow-hidden ">
      <nav
        className="fixed top-12 w-full bg-[var(--bg)] grid grid-flow-col justify-stretch justify-items-center pt-1 font-semibold z-20 border-b-[1px] border-[var(--gr2)]"
        aria-label="Anime sections"
      >
        {sections.map((item) => {
          return (
            <button
              key={item.name}
              type="button"
              aria-current={active === item.name ? 'page' : undefined}
              onClick={() => setActive(item.name)}
              className={`rounded cursor-pointer animeSection text-[var(--tx)] no-underline text-sm pb-1 text-center w-full bg-transparent border-0 ${
                active === item.name ? 'active' : ''
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </nav>

      <main>
        {sections.map((item, i) => {
          return (
            <section
              key={item.name}
              id={item.name}
              className={`relative h-screen ${
                active === item.name ? '' : 'hidden'
              }`}
            >
              <div
                className={` diva top-[4.6rem]  w-[31.5vw] h-[4px] rounded-full absolute z-20 bg-[var(--theme-color)] `}
                style={{ '--p': `${i * 34}vw` }}
              ></div>
              <div className=" absolute bottom-0 w-full h-[85vh] overflow-auto">
                {item.div}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
