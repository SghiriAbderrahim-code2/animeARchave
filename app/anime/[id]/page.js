'use client';

import React, { useState, useEffect } from 'react';

import { usePathname } from 'next/navigation';
import AnimeDetails from '../../../components/anime/AnimeDetails';
import AnimeCharacters from '../../../components/anime/AnimeCharacters';
import AnimePictures from '../../../components/anime/AnimePictures';
import Load from '../../../components/loading';
import isAdult from '../../../components/isAdult';

export default function Page() {
  const path = usePathname();
  const id = path.split('/')[2];
  const [active, setActive] = useState('Details');
  // تحميل كسول: نجلب بيانات التبويب فقط عند زيارته لأول مرة
  const [visited, setVisited] = useState(() => new Set(['Details']));
  // بوابة المحتوى: نتحقق من تصنيف الأنمي قبل عرض أي محتوى
  // لمنع ظهور محتوى +18 عند الوصول المباشر بالرابط
  const [gate, setGate] = useState('checking'); // 'checking' | 'ok' | 'blocked'

  const handleTab = (name) => {
    setActive(name);
    setVisited((prev) => {
      if (prev.has(name)) return prev;
      const next = new Set(prev);
      next.add(name);
      return next;
    });
  };

  useEffect(() => {
    let cancelled = false;
    setGate('checking');

    (async () => {
      try {
        const response = await fetch(`https://api.tenrai.org/v1/anime/${id}`);
        const result = await response.json();
        if (cancelled) return;
        setGate(result?.data && isAdult(result.data) ? 'blocked' : 'ok');
      } catch {
        // فشل الفحص لا يمنع عرض المحتوى السليم
        if (!cancelled) setGate('ok');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const sections = [
    { name: 'Details', div: <AnimeDetails id={id} /> },
    { name: 'Characters', div: <AnimeCharacters id={id} /> },
    { name: 'Pictures', div: <AnimePictures id={id} /> },
  ];

  if (gate === 'checking') {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <Load />
      </div>
    );
  }

  if (gate === 'blocked') {
    return (
      <div className="w-screen h-screen grid place-items-center px-4">
        <p role="alert" className="text-center p-4 text-red-400">
          This anime is unavailable: 18+ content is not allowed.
        </p>
      </div>
    );
  }

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
              onClick={() => handleTab(item.name)}
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
          if (!visited.has(item.name)) return null;
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
