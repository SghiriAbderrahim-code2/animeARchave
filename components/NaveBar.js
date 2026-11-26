'use client';
import React, { useEffect, useRef } from 'react';
import { Back, Filter, Search, Menu, Sort } from './svgs';
import Icon from './IconContainer';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import SortContainer from './sort/SortContainer';
import FilterContainer from './filter/FilterContainer';
import { useShow, useSearch } from '@/stores/store';

const PULL_THRESHOLD = 220;

export default function NaveBar() {
  const reset = useSearch((state) => state.reset);
  const path = usePathname();
  const router = useRouter();
  const setSortShow = useShow((state) => state.setSortShow);
  const setFilterShow = useShow((state) => state.setFilterShow);

  const refreshCont = useRef(null);
  // نستخدم ref بدلاً من المتغيرات المحلية حتى لا تضيع القيم بين الإغلاقات
  const startYRef = useRef(0);
  const pullRef = useRef(-70);

  const initLoading = () => {
    refreshCont.current?.classList.add('loading');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const setPull = (value) => {
    pullRef.current = value;
    const node = refreshCont.current;
    if (node) node.style.marginTop = `${value}px`;
  };

  const pullStart = (e) => {
    startYRef.current = e.targetTouches[0].screenY;
  };

  const pull = (e) => {
    const screenY = e.targetTouches[0].screenY;
    const pullLength =
      screenY > startYRef.current ? Math.abs(screenY - startYRef.current) : 0;
    setPull(Math.min(pullLength, PULL_THRESHOLD + 40));

    const node = refreshCont.current;
    if (node) {
      const ready = pullLength >= PULL_THRESHOLD;
      const icon = node.querySelector('svg');
      if (icon) {
        const color = ready ? 'var(--theme-color)' : 'white';
        icon.setAttribute('fill', color);
        icon.setAttribute('stroke', color);
        icon.style.transform = `rotate(${
          ready ? PULL_THRESHOLD : pullLength
        }deg)`;
      }
    }
  };

  const endPull = () => {
    if (pullRef.current >= PULL_THRESHOLD) {
      initLoading();
      return;
    }
    startYRef.current = 0;
    setPull(-70);
  };

  useEffect(() => {
    const nav = document.querySelector('nav');
    if (!nav) return;

    nav.addEventListener('touchstart', pullStart);
    nav.addEventListener('touchmove', pull);
    nav.addEventListener('touchend', endPull);

    return () => {
      nav.removeEventListener('touchstart', pullStart);
      nav.removeEventListener('touchmove', pull);
      nav.removeEventListener('touchend', endPull);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      className=" fixed z-50 left-0 top-0  flex w-screen items-center justify-between p-6 lg:px-8 h-8 bg-[var(--bg)] border-b border-[var(--gr)]"
      aria-label="Global"
    >
      <div
        ref={refreshCont}
        className="refresh-container w-fit -mt-20 right-1/2 translate-x-1/2 fixed "
        style={{ marginTop: '-70px' }}
      >
        <div className="refresh-icon p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 16 16"
            strokeWidth={1}
            stroke="white"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
            />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
          </svg>
        </div>
      </div>

      <SortContainer />
      <FilterContainer />
      <div className="flex gap-2">
        {path !== '/' ? (
          <Icon
            Action={() => {
              reset();
              router.back();
            }}
            icon={<Back />}
          ></Icon>
        ) : null}

        {path === '/' ? (
          <Link href="/search">
            <Icon
              Action={() => {
                reset();
              }}
              icon={<Search />}
            ></Icon>
          </Link>
        ) : null}
      </div>
      <div className="flex gap-2">
        {path === '/search' ? (
          <Icon
            Action={() => {
              setSortShow(true);
            }}
            icon={<Sort />}
          ></Icon>
        ) : null}
        {path === '/search' ? (
          <Icon
            Action={() => {
              setFilterShow(true);
            }}
            icon={<Filter />}
          ></Icon>
        ) : null}
        {path === '/search' ? null : (
          <Icon Action={() => {}} icon={<Menu />}></Icon>
        )}
      </div>
    </nav>
  );
}
