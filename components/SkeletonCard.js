import React from 'react';
import { shimmer, toBase64 } from './shimmer';

export default function SkeletonCard() {
  return (
    <div
      className="relative border-[var(--gr)] aspect-[1/1.5] rounded overflow-hidden bg-[var(--gr)] animate-pulse"
      style={{ boxShadow: '0 0 5px var(--shadow)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent animate-shimmer" />
    </div>
  );
}
