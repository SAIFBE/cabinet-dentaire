export function Spinner({ size = 'default' }) {
  return (
    <div className="spinner-container">
      <div className={`spinner ${size === 'sm' ? 'spinner--sm' : ''}`} />
    </div>
  );
}
