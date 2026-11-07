import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<Props> = ({ 
  size = 'md', 
  showWordmark = true, 
  className = '' 
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Visual Mark: Combined Pin & Magnifying Glass */}
      <div className={`relative ${iconDimensions} rounded-xl bg-blue-950 flex items-center justify-center shadow-xs overflow-hidden shrink-0`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Subtle pin body contour */}
          <path
            d="M24 6C16.82 6 11 11.82 11 19C11 28 22.2 40.8 23.25 41.95C23.65 42.4 24.35 42.4 24.75 41.95C25.8 40.8 37 28 37 19C37 11.82 31.18 6 24 6Z"
            fill="#1E3A8A"
            stroke="#3B82F6"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Search Lens inside Pin */}
          <circle
            cx="23"
            cy="18"
            r="7"
            stroke="#93C5FD"
            strokeWidth="2.4"
            fill="#2563EB"
            fillOpacity="0.4"
          />
          {/* Glass glare arc */}
          <path
            d="M20 15C21 14 22.5 13.5 24 13.8"
            stroke="#FFFFFF"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* Search Glass Handle */}
          <path
            d="M28 23L33 28"
            stroke="#93C5FD"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* Center pinpoint */}
          <circle cx="23" cy="18" r="1.8" fill="#FFFFFF" />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 leading-tight">
            <span className={`${textSize} font-extrabold tracking-tight text-slate-900`}>
              ReFind
            </span>
            <span className={`${textSize} font-bold tracking-tight text-blue-600`}>
              Campus
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
