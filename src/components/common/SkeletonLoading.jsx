import React from 'react';
import { motion } from 'framer-motion';

const SkeletonBase = ({ width = "100%", height = "20px", className = "" }) => (
  <motion.div
    className={`skeleton-bg rounded ${className}`}
    style={{ width, height }}
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  />
);

export const SkeletonText = ({ lines = 3, lineHeight = "20px", className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonBase
        key={index}
        height={lineHeight}
        width={index === lines - 1 ? "75%" : "100%"}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = "" }) => (
  <div className={`border rounded-lg p-4 ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonBase width="60px" height="60px" className="rounded-full" />
      <div className="flex-1">
        <SkeletonBase width="150px" height="20px" className="mb-2" />
        <SkeletonBase width="100px" height="16px" />
      </div>
    </div>
    <SkeletonText lines={3} />
    <div className="flex justify-between mt-4">
      <SkeletonBase width="80px" height="32px" className="rounded" />
      <SkeletonBase width="80px" height="32px" className="rounded" />
    </div>
  </div>
);

export const SkeletonReservationCard = ({ className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
    <div className="mb-3">
      <SkeletonBase width="120px" height="24px" className="mb-2" />
      <SkeletonBase width="80px" height="16px" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="flex justify-between">
        <SkeletonBase width="40px" height="16px" />
        <SkeletonBase width="60px" height="16px" />
      </div>
      <div className="flex justify-between">
        <SkeletonBase width="50px" height="16px" />
        <SkeletonBase width="30px" height="16px" />
      </div>
      <div className="flex justify-between">
        <SkeletonBase width="35px" height="16px" />
        <SkeletonBase width="45px" height="16px" />
      </div>
    </div>
    <div className="flex justify-between">
      <SkeletonBase width="65px" height="32px" className="rounded" />
      <SkeletonBase width="65px" height="32px" className="rounded" />
      <SkeletonBase width="65px" height="32px" className="rounded" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = "" }) => (
  <div className={`border rounded-lg overflow-hidden ${className}`}>
    <div className="bg-gray-50 p-4 border-b">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonBase key={index} width="80px" height="20px" />
        ))}
      </div>
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="p-4 border-b border-gray-100">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonBase key={colIndex} height="16px" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonForm = ({ className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    <div>
      <SkeletonBase width="100px" height="16px" className="mb-2" />
      <SkeletonBase height="40px" className="rounded" />
    </div>
    <div>
      <SkeletonBase width="80px" height="16px" className="mb-2" />
      <SkeletonBase height="40px" className="rounded" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <SkeletonBase width="60px" height="16px" className="mb-2" />
        <SkeletonBase height="40px" className="rounded" />
      </div>
      <div>
        <SkeletonBase width="70px" height="16px" className="mb-2" />
        <SkeletonBase height="40px" className="rounded" />
      </div>
    </div>
    <SkeletonBase width="150px" height="45px" className="rounded" />
  </div>
);

export const SkeletonAdminStats = ({ className = "" }) => (
  <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow p-6">
        <SkeletonBase width="40px" height="40px" className="rounded mb-4" />
        <SkeletonBase width="120px" height="24px" className="mb-2" />
        <SkeletonBase width="60px" height="32px" />
      </div>
    ))}
  </div>
);

export const SkeletonUserList = ({ count = 6, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonReservationCard key={index} />
    ))}
  </div>
);

export const SkeletonPage = ({ className = "" }) => (
  <div className={`container mx-auto px-4 py-8 ${className}`}>
    <SkeletonBase width="300px" height="36px" className="mb-6" />
    <SkeletonAdminStats className="mb-8" />
    <SkeletonTable rows={8} className="mb-8" />
  </div>
);

export default SkeletonBase;