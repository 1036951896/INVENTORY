import type { SelectHTMLAttributes, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export function Select({ children, className = '', ...props }: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        className={`w-full px-4 py-2 border border-[#B6E1F2] rounded-lg focus:outline-none focus:border-[#386273] focus:ring-2 focus:ring-[#B6E1F2] focus:ring-opacity-50 appearance-none bg-white cursor-pointer transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );
}

interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

export function SelectTrigger({ children, className = '' }: SelectTriggerProps) {
  return (
    <div className={`relative w-full border border-[#B6E1F2] rounded-lg px-4 py-2 flex items-center justify-between cursor-pointer ${className}`}>
      {children}
      <ChevronDown className="w-5 h-5 text-gray-400" />
    </div>
  );
}

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder = 'Select...' }: SelectValueProps) {
  return <span className="text-gray-600">{placeholder}</span>;
}

interface SelectContentProps {
  children: ReactNode;
}

export function SelectContent({ children }: SelectContentProps) {
  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-[#B6E1F2] rounded-lg shadow-lg mt-1 z-50">
      {children}
    </div>
  );
}

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

export function SelectItem({ value, children }: SelectItemProps) {
  return (
    <option value={value} className="py-2 px-4 hover:bg-[#B6E1F2]">
      {children}
    </option>
  );
}
