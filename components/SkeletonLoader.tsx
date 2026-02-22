'use client';
import React from 'react';

const Shimmer = ({ className }: { className: string }) => (
  <div className={`relative overflow-hidden bg-white/5 rounded-lg ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/8 to-transparent" />
  </div>
);

export const HomePageSkeleton = () => (
  <div className="bg-[#030812] min-h-screen pt-16">
    {/* Hero skeleton */}
    <div className="px-4 pt-4 pb-8">
      <Shimmer className="w-[88%] mx-auto aspect-hero rounded-[2.5rem]" />
    </div>
    {/* Row skeletons */}
    {[1, 2, 3].map(i => (
      <div key={i} className="mb-8 px-4">
        <Shimmer className="w-40 h-5 mb-4 rounded-full" />
        <div className="flex gap-3 overflow-hidden">
          {[1,2,3,4,5].map(j => (
            <div key={j} className="flex-shrink-0 w-[104px]">
              <Shimmer className="w-full pb-[145%] rounded-lg" />
              <Shimmer className="w-full h-3 mt-2 rounded-full" />
              <Shimmer className="w-2/3 h-2.5 mt-1 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const PlayerPageSkeleton = () => (
  <div className="bg-[#0f0f0f] min-h-screen flex flex-col">
    <Shimmer className="w-full aspect-video" />
    <div className="p-4 space-y-4">
      <Shimmer className="w-3/4 h-8 rounded-xl" />
      <Shimmer className="w-1/2 h-5 rounded-xl" />
      <div className="flex gap-2">
        {[1,2,3,4].map(i => <Shimmer key={i} className="w-16 h-8 rounded-xl" />)}
      </div>
      <Shimmer className="w-full h-12 rounded-xl" />
      <Shimmer className="w-full h-24 rounded-xl" />
    </div>
  </div>
);
