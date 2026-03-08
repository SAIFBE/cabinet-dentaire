import { useState, useRef, useEffect } from 'react';

/**
 * Reusable file picker with image preview.
 * @param {{ label: string, accept?: string, onChange: (file: File|null) => void }} props
 */
export function ImageFileInput({ label, accept = 'image/*', onChange }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const prevUrl = useRef(null);

  // Revoke old object URL on unmount
  useEffect(() => () => { if (prevUrl.current) URL.revokeObjectURL(prevUrl.current); }, []);

  const handleChange = (e) => {
    const file = e.target.files?.[0] || null;
    // Revoke previous preview URL
    if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);

    if (file) {
      const url = URL.createObjectURL(file);
      prevUrl.current = url;
      setPreview(url);
      setFileName(file.name);
    } else {
      prevUrl.current = null;
      setPreview(null);
      setFileName('');
    }
    onChange(file);
  };

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input
        type="file"
        accept={accept}
        className="form-input"
        onChange={handleChange}
      />
      {fileName && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          {preview && (
            <img
              src={preview}
              alt={fileName}
              style={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 6,
                border: '1px solid var(--border-color, #e2e8f0)',
              }}
            />
          )}
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #64748b)' }}>
            {fileName}
          </span>
        </div>
      )}
    </div>
  );
}
