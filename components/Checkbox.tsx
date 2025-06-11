'use client';

import React, { useState } from 'react';

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  defaultChecked,
  onChange,
  className = '',
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
  const isControlled = typeof checked === 'boolean';
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalChecked(e.target.checked);
    }
    onChange?.(e.target.checked);
  };

  return (
    <label className={`flex items-start space-x-3 cursor-pointer select-none ${className}`}>
      <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={handleChange} />
      <span
        className={`h-[16px] w-[16px] flex items-center justify-center rounded border-[1px] border-solid border-[#A1A1A1]
        ${isChecked ? 'bg-[#FF7CFF]' : 'bg-[#FFFFFF]'}
        `}
      >
        {isChecked && (
          <svg
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_311_1599)">
              <path
                d="M2.5 6.5L5 9L10 4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_311_1599">
                <rect width="12" height="12" fill="white" transform="translate(0 0.5)" />
              </clipPath>
            </defs>
          </svg>
        )}
      </span>
    </label>
  );
};

export default Checkbox;
