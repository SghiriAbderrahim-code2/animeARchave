import React, { useState, useEffect, useRef, useCallback } from 'react';
import AnimeContainer from '../AnimeContainer';

export default function RelationDiv(promps) {
  const { data } = promps;
  const [animeData, setAnimeData] = useState('empty');
  const [error, setError] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const rootRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.tenrai.org/v1/anime/${data.mal_id}`
      );
      const result = await response.json();
      if (!result?.data) throw new Error('Not found');
      setAnimeData(result.data);
    } catch (err) {
      setError(err);
    }
  }, [data.mal_id]);

  // تحميل كسول: يجلب البيانات فقط عند اقتراب العنصر من الشاشة
  // (يقلل الطلبات المتزامنة ويمنع تجاوز حد معدل Jikan)
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldFetch(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldFetch(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldFetch) fetchData();
  }, [shouldFetch, fetchData]);

  if (error) return null;

  // الخطأ الأصلي: `=== "empty" | undefined` كان عملياً ثنائياً (bitwise)
  if (animeData === 'empty') {
    return <span ref={rootRef} className="hidden" aria-hidden="true" />;
  }

  return (
    <span ref={rootRef}>
      <AnimeContainer anime={animeData} />
    </span>
  );
}
