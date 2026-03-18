'use client';

import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  isDark?: boolean;
}

export default function FormField({ label, required, error, children, isDark }: FormFieldProps) {
  return (
    <div>
      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-neutral-300' : 'text-surface-600'}`}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
