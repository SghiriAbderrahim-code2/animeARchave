'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Load from '../../components/loading';
import List from '../../components/List';
import { useSearch } from '@/stores/store';
import SearchInput from '../../components/SearchInput';
import FilterChips from '../../components/FilterChips';

const buildQuery = () => {
  // نقرأ الحالة من المتجر مباشرة حتى تبقى الدالة مستقرة (stable)
  // ولا تحتاج إلى إعادة إنشائها عند كل تغيير في الفلاتر
  const s = useSearch.getState();
  const parts = [];
  // sfw + genres_exclude: منع أي محتوى +18 (Hentai/Erotica) من نتائج البحث
  parts.push('sfw=true');
  parts.push('genres_exclude=12,49');
  if (s.genres.length) parts.push(`genres=${s.genres}`);
  if (s.producers.length) parts.push(`producers=${s.producers}`);
  if (s.type) parts.push(`type=${s.type}`);
  if (s.statu) parts.push(`status=${s.statu}`);
  if (s.rating) parts.push(`rating=${s.rating}`);
  parts.push(`q=${encodeURIComponent(s.search)}`);
  parts.push(`order_by=${s.sort}`);
  parts.push(`sort=${s.sortDirection ? 'desc' : 'asc'}`);
  parts.push(`page=${s.page}`);
  return parts.join('&');
};

export default function Search() {
  const reLoad = useSearch((state) => state.reLoad);
  const searchValue = useSearch((state) => state.search);
  const sortValue = useSearch((state) => state.sort);
  const sortDirection = useSearch((state) => state.sortDirection);
  const setAnimeData = useSearch((state) => state.setAnimeData);
  const setSearchValue = useSearch((state) => state.setSearch);
  const reset = useSearch((state) => state.reset);
  const initSortDraft = useSearch((state) => state.initSortDraft);
  const applySortDraft = useSearch((state) => state.applySortDraft);
  const cancelSortDraft = useSearch((state) => state.cancelSortDraft);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const debounceRef = useRef(null);
  const isLoadingRef = useRef(false);
  const hasNextRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (isLoadingRef.current) return;

    // إلغاء أي جلب سابق قبل بدء جلب جديد (يمنع تداخل الصفحات)
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.tenrai.org/v1/anime?${buildQuery()}`,
        { signal: controller.signal }
      );
      const data = await response.json();
      if (!Array.isArray(data.data)) throw new Error('Invalid API response');

      // تجاهل النتائج إذا كان هذا الطلب قد أُلغي لصالح أحدث طلب
      if (abortRef.current !== controller) return;

      setAnimeData((prev) => [...prev, ...data.data]);
      hasNextRef.current = data.pagination?.has_next_page ?? false;
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

  const searching = useCallback(
    (value) => {
      // debounce 400ms: انتظار توقف الكتابة قبل إرسال الطلب
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSearchValue(value);
      }, 400);
    },
    [setSearchValue]
  );

  // إعادة الجلب عند تغيير نص البحث أو الفلاتر (reLoad) أو الفرز
  useEffect(() => {
    fetchData();
  }, [searchValue, reLoad, sortValue, sortDirection, fetchData]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

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

  useEffect(() => {
    initSortDraft();
    return () => cancelSortDraft();
    // reset مستقر من zustand ولا يحتاج إلى إعادة تشغيل
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-auto pt-14 flex flex-col">
      <SearchInput search={searching} />
      <FilterChips />
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