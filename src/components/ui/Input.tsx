import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, startIcon, className = '', ...rest }, ref) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: '#9ca3af' }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        {startIcon && (
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', display: 'flex', alignItems: 'center' }}>
            {startIcon}
          </span>
        )}
        <input
          ref={ref}
          className={`input ${error ? 'error' : ''} ${className}`}
          style={{ paddingLeft: startIcon ? 38 : 16 }}
          {...rest}
        />
      </div>
      {error && <p style={{ fontSize: 12, color: '#f87171', marginTop: 2 }}>{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
