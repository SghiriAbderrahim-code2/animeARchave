import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Load from '../loading';
import ImageFull from './imageFullScreen';

export default function AnimePictures(promps) {
  const { id } = promps;
  const [data, setData] = useState('empty');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setData('empty');
    setError(null);

    (async () => {
      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/anime/${id}/pictures`
        );
        const result = await response.json();
        if (cancelled) return;
        if (!Array.isArray(result?.data)) throw new Error('Invalid response');
        setData(result.data);
      } catch (err) {
        if (cancelled) return;
        setError(err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

  const toBase64 = (str) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);

  if (error) {
    return (
      <p role="alert" className="text-center p-4 text-red-400">
        Error: {error.message}
      </p>
    );
  }

  if (data === 'empty' || data === undefined) {
    return <Load />;
  }

  return (
    <div className="w-full grid lg:grid-cols-8  sm:grid-cols-6 grid-cols-3 p-2 gap-2">
      {data.map((item, i) => {
        return (
          <div
            key={i}
            className=" border-[var(--gr)] aspect-[1/1.5] rounded overflow-hidden relative bg-[var(--gr)] "
            style={{ boxShadow: '0 0 5px var(--shadow)' }}
          >
            <Image
              placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
              src={item.jpg.large_image_url}
              width={225}
              height={385}
              alt="picture"
              className=" object-fill w-full h-full"
            />

            <ImageFull url={item.jpg.large_image_url} />
          </div>
        );
      })}
    </div>
  );
}
