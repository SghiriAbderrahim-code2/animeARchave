'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import List from '../components/List';
import Load from '../components/loading';
import { useSearch } from '@/stores/store';

export default function Home() {
  const setAnimeData = useSearch((state) => state.setAnimeData);
  const reset = useSearch((state) => state.reset);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNext, setHasNext] = useState(true);

  const abortRef = useRef(null);
  // نخزن القيم في ref حتى لا يصبح مستمع التمرير قديم الإغلاق (stale closure)
  const isLoadingRef = useRef(true);
  const hasNextRef = useRef(true);

  const fetchData = useCallback(async () => {
    // إلغاء أي طلب سابق حتى لا تتراكم الطلبات المتزامنة عند التمرير السريع
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
    // إعادة الضبط عند الدخول لمنع نتائج البحث السابقة من الظهور كأنها نتائج الصفحة الرئيسية
    reset();
    fetchData();
    return () => abortRef.current?.abort();
  }, [reset, fetchData]);

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
      {isLoading && <Load />}
      {error && (
        <p role="alert" className="text-center p-4 text-red-400">
          Error: {error.message}
        </p>
      )}
    </div>
  );
}
