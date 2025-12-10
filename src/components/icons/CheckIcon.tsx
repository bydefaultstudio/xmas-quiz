import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function CheckIcon({ size = 24, color = 'currentColor', className }: IconProps) {
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
        d="M9.55001 18L3.85001 12.3L5.27501 10.875L8.13579 13.7358C8.91684 14.5168 10.1832 14.5168 10.9642 13.7358L18.725 5.97501L20.15 7.40001L9.55001 18Z"
        fill={color}
      />
    </svg>
  );
}

