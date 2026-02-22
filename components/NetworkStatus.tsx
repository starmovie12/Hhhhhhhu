'use client';
import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      setTimeout(() => setShowRestored(false), 3000);
    };
    const onOffline = () => { setIsOnline(false); setShowRestored(false); };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  if (isOnline && !showRestored) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-center gap-2 py-2.5 text-sm font-bold transition-all ${!isOnline ? 'bg-red-600' : 'bg-green-600'}`}>
      {!isOnline ? <WifiOff size={16} /> : <Wifi size={16} />}
      {!isOnline ? 'You are offline' : '✓ Connection restored'}
    </div>
  );
};
