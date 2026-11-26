'use client';
import React from 'react';
export default function Icon({ icon, Action }) {
  return (
    <div
      onClick={() => {
        Action();
      }}
      className="fill-[var(--tx)]  text-xl hover:bg-[var(--gr)] p-2 rounded-full "
    >
      {icon}
    </div>
  );
}
