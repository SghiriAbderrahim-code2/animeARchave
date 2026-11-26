import React, { useState, useEffect, useCallback } from 'react';
import Load from '../loading';

export default function AnimeEpisodes(promps) {
  const { id } = promps;
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.tenrai.org/v1/anime/${id}/episodes?page=${page}`
      );
      const result = await response.json();
      if (!Array.isArray(result?.data)) throw new Error('Invalid response');
      // تحديث وظيفي: يمنع تكرار العناصر ويتعامل مع الصفحة الجديدة بشكل صحيح
      setData((prev) => [...prev, ...result.data]);
      if (result.pagination?.has_next_page) {
        setPage((p) => p + 1);
      }
    } catch (err) {
      setError(err);
    }
  }, [id, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return (
      <p role="alert" className="text-center p-4 text-red-400">
        Error: {error.message}
      </p>
    );
  }

  if (data.length === 0) {
    return <Load />;
  }

  return (
    <div className="w-full">
      {data.map((item, i) => {
        return (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className={`${item.mal_id == null ? 'hidden' : null}`}
          >
            <div className=" relative flex p-2 pb-4 items-baseline justify-between border-b border-b-[var(--gr)] hover:bg-[var(--gr)]">
              <div className="absolute bottom-1 left-2 text-xs text-[var(--gr3)] ">
                {item.aired == null ? '????-??-??' : item.aired.split('T')[0]}
              </div>
              <div className="font-bold text-sm mb-1 ">
                Episode : {item.mal_id == null ? '??' : item.mal_id}
              </div>
              <div
                className={`${
                  item.filler ? null : 'hidden'
                } bg-[var(--theme-color)] px-2 rounded text-[var(--bg)] `}
              >
                Filler
              </div>

              <div className=" font-semibold text-sm text-yellow-400">
                {item.score == null ? '?.?' : item.score}/10
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
