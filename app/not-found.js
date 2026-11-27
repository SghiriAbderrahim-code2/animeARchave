'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--tx)] px-4">
      <h2 className="text-4xl font-bold mb-4 text-[var(--theme-color)]">404</h2>
      <p className="text-lg text-[var(--gr3)] mb-6 text-center">Could not find requested resource</p>
      <Link
        href="/"
        className="px-6 py-2 rounded-full bg-[var(--theme-color)] text-[var(--bg)] font-bold hover:opacity-90 transition-opacity"
      >
        Return Home
      </Link>
    </div>
  );
}
