'use client';

import { DollarSign } from 'lucide-react';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  currency: string;
  variant?: 'default' | 'test';
}

export function AmountInput({
  value,
  onChange,
  currency,
  variant = 'default',
}: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Only allow numbers and decimal point
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-fg">
        {variant === 'test' ? 'Test Amount' : 'Amount'}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="0.00"
          className="input-field text-2xl font-semibold pl-12 pr-20"
        />
        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted" />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-accent text-bg rounded-md text-sm font-medium">
          {currency}
        </div>
      </div>
      {variant === 'test' && (
        <p className="text-xs text-text-muted">
          Recommended: $1-5 for test transfers
        </p>
      )}
    </div>
  );
}
