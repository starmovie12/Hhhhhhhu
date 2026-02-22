'use client';
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 z-40 w-11 h-11 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-900/50 active:scale-90 transition-all animate-fadeIn"
    >
      <ChevronUp size={22} strokeWidth={2.5} />
    </button>
  );
};
