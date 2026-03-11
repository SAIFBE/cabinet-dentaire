export function ResponsiveFormGrid({ children, columns = 2 }) {
  // Use CSS class `.form-row` combined with inline style logic or simple utility classes.
  // In index.css, .form-row naturally stacks on mobile. We just wrap children.
  return (
    <div 
      className="form-row" 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${columns}, 1fr)`, 
        gap: 'var(--space-md)' 
      }}
    >
      {children}
    </div>
  );
}
