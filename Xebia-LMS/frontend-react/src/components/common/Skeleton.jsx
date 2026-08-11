import React from "react";

export function SkeletonPulse({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
      {...props}
    />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm flex flex-col h-[340px]">
      <SkeletonPulse className="h-44 rounded-b-none" />
      <div className="p-5 flex-1 flex flex-col gap-3">
        <SkeletonPulse className="h-4 w-1/4" />
        <SkeletonPulse className="h-6 w-3/4" />
        <SkeletonPulse className="h-4 w-full" />
        <div className="mt-auto flex items-center justify-between">
          <SkeletonPulse className="h-4 w-1/3" />
          <SkeletonPulse className="h-8 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function LessonSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <SkeletonPulse className="h-8 w-1/3" />
      <SkeletonPulse className="h-4 w-1/4" />
      <div className="flex flex-col gap-3">
        <SkeletonPulse className="h-20 w-full" />
        <SkeletonPulse className="h-32 w-full" />
        <SkeletonPulse className="h-24 w-full" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="border border-border rounded-xl bg-white overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border flex justify-between">
        <SkeletonPulse className="h-6 w-1/4" />
        <SkeletonPulse className="h-8 w-1/6" />
      </div>
      <div className="p-6">
        <div className="flex gap-4 mb-4 border-b border-border pb-2">
          {Array.from({ length: cols }).map((_, idx) => (
            <SkeletonPulse key={idx} className="h-5 flex-1" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: rows }).map((_, rIdx) => (
            <div key={rIdx} className="flex gap-4">
              {Array.from({ length: cols }).map((_, cIdx) => (
                <SkeletonPulse key={cIdx} className="h-6 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
