import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full px-4 py-2 border border-[#B6E1F2] rounded-lg focus:outline-none focus:border-[#386273] focus:ring-2 focus:ring-[#B6E1F2] focus:ring-opacity-50 transition-colors ${className}`}
      {...props}
    />
  );
}
