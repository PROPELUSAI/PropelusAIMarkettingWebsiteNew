'use client';

import Select, { StylesConfig, GroupBase } from 'react-select';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  isDark?: boolean;
}

export default function FormSelect({ options, value, onChange, placeholder = 'Select...', disabled = false, error, isDark = false }: FormSelectProps) {
  const selected = options.find((o) => o.value === value) || null;

  const styles: StylesConfig<SelectOption, false, GroupBase<SelectOption>> = {
    control: (base, state) => ({
      ...base,
      background: isDark ? 'rgba(255,255,255,0.05)' : 'var(--bg-light, #f8f8fa)',
      borderColor: error
        ? '#ef4444'
        : state.isFocused
          ? 'var(--brand, #635bff)'
          : isDark ? 'rgba(255,255,255,0.1)' : 'var(--border-light, #e8e8ee)',
      borderRadius: 'var(--radius-sm, 0.5rem)',
      padding: '4px 4px',
      minHeight: '44px',
      fontSize: '0.9375rem',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(99,91,255,0.1)' : 'none',
      cursor: 'pointer',
      '&:hover': {
        borderColor: state.isFocused ? 'var(--brand, #635bff)' : isDark ? 'rgba(255,255,255,0.2)' : 'var(--border-light, #d1d5db)',
      },
    }),
    menu: (base) => ({
      ...base,
      background: isDark ? '#1a1a2e' : '#fff',
      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--border-light, #e8e8ee)',
      borderRadius: 'var(--radius-sm, 0.5rem)',
      boxShadow: 'var(--shadow-lg, 0 10px 30px rgba(0,0,0,0.12))',
      zIndex: 50,
      overflow: 'hidden',
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '200px',
      padding: '4px',
    }),
    option: (base, state) => ({
      ...base,
      fontSize: '0.875rem',
      padding: '8px 12px',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      background: state.isSelected
        ? 'var(--brand, #635bff)'
        : state.isFocused
          ? isDark ? 'rgba(255,255,255,0.08)' : 'var(--bg-light, #f5f5f7)'
          : 'transparent',
      color: state.isSelected
        ? '#fff'
        : isDark ? '#e5e7eb' : 'var(--text-primary, #1a1a2e)',
      '&:active': {
        background: state.isSelected ? 'var(--brand, #635bff)' : isDark ? 'rgba(255,255,255,0.12)' : '#eef',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? '#fff' : 'var(--text-primary, #1a1a2e)',
      fontSize: '0.9375rem',
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? 'rgba(255,255,255,0.35)' : 'var(--text-tertiary, #999)',
      fontSize: '0.9375rem',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--text-tertiary, #999)',
      padding: '0 8px',
      transition: 'transform 0.2s',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0)',
      '&:hover': { color: 'var(--brand, #635bff)' },
    }),
    input: (base) => ({
      ...base,
      color: isDark ? '#fff' : 'var(--text-primary, #1a1a2e)',
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: '0.875rem',
      color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--text-tertiary, #999)',
    }),
  };

  return (
    <div>
      <Select
        options={options}
        value={selected}
        onChange={(opt) => onChange(opt?.value || '')}
        placeholder={placeholder}
        isDisabled={disabled}
        isSearchable
        styles={styles}
        menuPlacement="auto"
        classNamePrefix="rs"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
