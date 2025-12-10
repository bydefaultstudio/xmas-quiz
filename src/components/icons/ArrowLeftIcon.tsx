import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function ArrowLeftIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10.2392 13C9.34831 13 8.90214 14.0771 9.53211 14.7071L13.425 18.6L12 20L4 12L12 4L13.425 5.4L9.53211 9.29289C8.90214 9.92286 9.34831 11 10.2392 11H20V13H10.2392Z"
        fill={color}
      />
    </svg>
  );
}

