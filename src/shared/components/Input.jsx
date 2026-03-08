import { forwardRef } from 'react';

/**
 * Input component — SECURITY: never renders raw HTML.
 * All user input is safely handled via React's value binding.
 */
export const Input = forwardRef(function Input(
  { label, error, type = 'text', id, className = '', ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      {type === 'select' ? (
        <select
          id={inputId}
          ref={ref}
          className={`form-select ${error ? 'form-input--error' : ''} ${className}`}
          {...props}
        />
      ) : type === 'textarea' ? (
        <textarea
          id={inputId}
          ref={ref}
          className={`form-input ${error ? 'form-input--error' : ''} ${className}`}
          rows={3}
          {...props}
        />
      ) : (
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={`form-input ${error ? 'form-input--error' : ''} ${className}`}
          {...props}
        />
      )}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
});
