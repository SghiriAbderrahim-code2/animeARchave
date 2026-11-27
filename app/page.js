'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import List from '../components/List';
import Load from '../components/loading';
import SkeletonCard from '../components/SkeletonCard';
import { useSearch } from '@/stores/store';

export default function Home() {
  const animeData = useSearch((state) => state.animeData);
  const setAnimeData = useSearch((state) => state.setAnimeData);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [hasNext, setHasNext] = React.useState(true);

  const abortRef = useRef(null);
  const isLoadingRef = useRef(true);
  const hasNextRef = useRef(true);

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.tenrai.org/v1/top/anime?page=${useSearch.getState().page}&sfw=true`,
        { signal: controller.signal }
      );
      const data = await response.json();
      if (!Array.isArray(data.data)) throw new Error('Invalid API response');
      if (abortRef.current !== controller) return;

      setAnimeData((prev) => [...prev, ...data.data]);
      const next = data.pagination?.has_next_page ?? false;
      setHasNext(next);
      hasNextRef.current = next;
      useSearch.getState().setPage();
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (abortRef.current !== controller) return;
      setError(err);
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    }
  }, [setAnimeData]);

  useEffect(() => {
    // جلب البيانات فقط إذا كانت القائمة فارغة للحفاظ على مكان المستخدم عند الرجوع
    if (animeData.length === 0) {
      fetchData();
    } else {
      setIsLoading(false);
    }
    return () => abortRef.current?.abort();
  }, [fetchData, animeData.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 50 &&
        !isLoadingRef.current &&
        hasNextRef.current
      ) {
        fetchData();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchData]);

  return (
    <div className="relative overflow-auto mt-14">
      <List />
      {isLoading && animeData.length === 0 && (
        <div className="grid lg:grid-cols-6 sm:grid-cols-4 grid-cols-2 gap-2 p-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
      {isLoading && animeData.length > 0 && <Load />}
      {!hasNext && animeData.length > 0 && (
        <p className="text-center p-6 text-[var(--gr3)] text-sm font-semibold">
          🎉 You&apos;ve reached the end of the archive!
        </p>
      )}
      {error && (
        <p role="alert" className="text-center p-4 text-red-400">
          Error: {error.message}
        </p>
      )}
    </div>
  );
}
