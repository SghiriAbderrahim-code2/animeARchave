import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUp, ArrowDown } from '../svgs';
import Load from '../loading';
import Relations from './Relations';

export default function AnimeDetails(promps) {
  const { id } = promps;
  const [slide, setSlide] = useState(false);
  const [data, setData] = useState('empty');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setData('empty');
    setError(null);

    (async () => {
      try {
        const response = await fetch(`https://api.tenrai.org/v1/anime/${id}/full`);
        const result = await response.json();
        if (cancelled) return;
        if (!result?.data) throw new Error('Anime not found');
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

  const genres = [
    ...(data.genres ?? []),
    ...(data.explicit_genres ?? []),
    ...(data.demographics ?? []),
    ...(data.themes ?? []),
  ];

  return (
    <div>
      <div className="flex flex-col items-center mb-4 overflow-y-auto">
        <div className=" w-full grid grid-cols-3 ">
          <div className="aspect-[1/1.5] h-4/5 place-self-center">
            <Image
              src={data.images?.jpg?.large_image_url}
              width={225}
              height={385}
              alt={data.title ?? 'anime'}
              className=" object-fill w-full h-full rounded"
            />
          </div>
          <div className="col-span-2 p-1 self-center text-[var(--gr3)]">
            <p className="lg:text-4xl text-xl mb-2">{data.title}</p>
            <p className="lg:text-lg text-xs text-[var(--gr3)] ">
              {data.status == null ? '???? ???' : data.status}
            </p>
            <p className="lg:text-lg text-xs text-[var(--gr3)]">{`${
              data.season == null ? '????' : data.season
            } - ${
              data.aired?.prop?.from?.year == null
                ? '????'
                : data.aired.prop.from.year
            }`}</p>
            <p className="lg:text-lg text-xs text-[var(--gr3)]">{`${
              data.type == null ? '???' : data.type
            } - ${data.episodes == null ? '??' : data.episodes} episodes - ${
              data.rating == null ? '????' : data.rating.split(' - ')[1]
            }`}</p>
          </div>
        </div>
        <div className="w-11/12 bg-[var(--gr)]  rounded">
          <div
            onClick={() => {
              setSlide(!slide);
            }}
            className={`mb-3 text-sm w-full p-4 pb-4 ${
              slide ? null : 'lg:h-20 h-16'
            } overflow-hidden cursor-pointer relative lg:text-lg`}
          >
            {data.synopsis}
            <div className="absolute bottom-0 left-0 w-full flex justify-center fill-[var(--tx)] bg-gradient-to-t from-[var(--gr)] pt-2">
              {slide ? <ArrowUp /> : <ArrowDown />}
            </div>
          </div>
          <div
            className={`flex gap-2 ${
              slide ? 'flex-wrap' : 'overflow-auto'
            }  p-2`}
          >
            {genres.map((item, i) => {
              return (
                <div
                  key={i}
                  className="whitespace-nowrap w-auto bg-[var(--gr2)] px-4 rounded-full font-semibold lg:text-lg text-sm"
                >
                  {item.name}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 p-4 gap-4">
            {[
              {
                name: 'Source',
                value: data.source == null ? '????' : data.source,
              },
              {
                name: 'Duration',
                value: data.duration == null ? '?? ???' : data.duration,
              },
              {
                name: 'Started in',
                value:
                  data.aired?.from == null
                    ? '????-??-??'
                    : data.aired.from.split('T')[0],
              },
              {
                name: 'Ended in',
                value:
                  data.aired?.to == null
                    ? '????-??-??'
                    : data.aired.to.split('T')[0],
              },
              {
                name: 'Studio',
                value:
                  data.studios?.[0] == undefined
                    ? '?????'
                    : data.studios[0].name,
              },
              {
                name: 'Episodes',
                value: data.episodes == null ? '????' : data.episodes,
              },
            ].map((item, i) => {
              return (
                <div key={i}>
                  <p className="lg:text-xl text-sm font-semibold">
                    {item.name} :
                  </p>
                  <p className=" lg:text-lg text-xs font-semibold text-[var(--gr3)] ">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full font-bold text-lg p-4 mt-4">
          <h1>Trailer :</h1>
          <div className=" mx-auto mt-8 rounded border aspect-[16/9] lg:w-1/2 w-4/5 overflow-hidden">
            {data.trailer?.youtube_id ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${data.trailer.youtube_id}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <p className="p-4 text-center text-[var(--gr3)]">No trailer</p>
            )}
          </div>
        </div>
        <div className=" w-full font-bold text-lg p-4 mt-4">
          <h1>Relations :</h1>
          <div className="w-full overflow-hidden grid lg:grid-cols-8  sm:grid-cols-5 grid-cols-3 gap-2 py-3">
            {(data.relations ?? []).map((item, i) => {
              return <Relations key={i} data={item} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
