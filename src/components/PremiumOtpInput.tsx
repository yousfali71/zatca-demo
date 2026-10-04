'use client';

import React, { useRef, useState, useEffect } from 'react';

interface PremiumOtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
}

export const PremiumOtpInput: React.FC<PremiumOtpInputProps> = ({
  length = 6,
  value = '',
  onChange,
  disabled = false
}) => {
  const [digits, setDigits] = useState<string[]>(() => {
    const arr = value.split('');
    return Array.from({ length }, (_, i) => arr[i] || '');
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync internal digits state when external value changes (e.g. sandbox preset '123345')
  useEffect(() => {
    const arr = value.split('');
    const newDigits = Array.from({ length }, (_, i) => arr[i] || '');
    setDigits(newDigits);
  }, [value, length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    // Extract last typed numeric digit
    const digit = val.replace(/[^0-9]/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    const combined = newDigits.join('');
    onChange(combined);

    // Auto-advance focus to next digit if filled
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move to previous box if current box is already empty
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current box
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').slice(0, length);
    if (!pastedData) return;

    const newDigits = Array.from({ length }, (_, i) => pastedData[i] || '');
    setDigits(newDigits);
    onChange(newDigits.join(''));

    // Focus last filled digit or final box
    const nextFocusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', direction: 'ltr' }}>
      {Array.from({ length }).map((_, index) => {
        const isFilled = Boolean(digits[index]);
        return (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[index] || ''}
            disabled={disabled}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            style={{
              width: 48,
              height: 56,
              borderRadius: 8,
              border: isFilled ? '2px solid #0F172A' : '1.5px solid #CBD5E1',
              backgroundColor: isFilled ? '#F8FAFC' : '#FFFFFF',
              color: '#0F172A',
              fontSize: 22,
              fontWeight: 800,
              fontFamily: 'monospace',
              textAlign: 'center',
              outline: 'none',
              transition: 'all 0.15s ease',
              boxShadow: isFilled ? '0 2px 4px rgba(15, 23, 42, 0.06)' : 'none',
              cursor: disabled ? 'not-allowed' : 'text'
            }}
          />
        );
      })}
    </div>
  );
};
