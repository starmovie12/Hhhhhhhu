'use client';
import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 600);
    const t2 = setTimeout(() => setPhase('out'), 2200);
    const t3 = setTimeout(onDone, 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#030812] flex flex-col items-center justify-center transition-opacity duration-500 ${phase === 'out' ? 'opacity-0' : 'opacity-100'}`}>
      {/* Glow background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-64 h-64 rounded-full bg-red-600/20 blur-[80px] transition-all duration-700 ${phase === 'hold' ? 'scale-150 opacity-100' : 'scale-50 opacity-0'}`} />
      </div>

      {/* Logo */}
      <div className={`relative flex flex-col items-center gap-3 transition-all duration-700 ${phase === 'in' ? 'scale-50 opacity-0 translate-y-8' : 'scale-100 opacity-100 translate-y-0'}`}>
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-900/60">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
          </svg>
        </div>
        <span className="text-5xl font-[900] tracking-[-0.05em] text-white uppercase italic">MFLIX</span>
        <p className={`text-white/40 text-sm font-bold tracking-[0.3em] uppercase transition-all duration-500 delay-300 ${phase === 'hold' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          Cinema. Redefined.
        </p>
      </div>

      {/* Loading bar */}
      <div className="absolute bottom-16 w-32 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full bg-red-600 rounded-full transition-all duration-2000 ease-out ${phase !== 'in' ? 'w-full' : 'w-0'}`} style={{ transitionDuration: '2000ms' }} />
      </div>
    </div>
  );
};
