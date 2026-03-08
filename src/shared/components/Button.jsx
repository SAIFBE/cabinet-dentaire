export function Button({ children, variant = 'primary', size, full, type = 'button', disabled, loading, onClick, className = '' }) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' && 'btn--sm',
    full && 'btn--full',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type={type} className={classes} disabled={disabled || loading} onClick={onClick}>
      {loading && <span className="spinner spinner--sm" />}
      {children}
    </button>
  );
}
