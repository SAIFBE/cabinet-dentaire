import { useState, useRef } from 'react';
import { Upload, X, File as FileIcon, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function FileDropzone({
  onFileSelect,
  accept = "image/jpeg, image/png, application/dicom, .dcm",
  maxSizeMB = 20,
  instructionText = "Cliquez ou glissez un fichier ici",
  subInstructionText = "Max 20MB (JPG, PNG, DICOM)",
  errorText = ""
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState('');
  const fileInputRef = useRef(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateAndHandleFile = (file) => {
    setLocalError('');
    if (!file) return;

    if (file.size > maxSizeBytes) {
      setLocalError(`Le fichier dépasse la taille maximale autorisée de ${maxSizeMB}MB.`);
      return;
    }

    // Pass valid file up
    onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndHandleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const currentError = errorText || localError;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload file dropzone"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        style={{
          border: `2px dashed ${isDragOver ? 'var(--color-primary)' : currentError ? 'var(--color-danger)' : 'var(--color-border)'}`,
          backgroundColor: isDragOver ? 'rgba(123, 106, 230, 0.05)' : currentError ? 'rgba(239, 68, 68, 0.05)' : 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          outline: 'none',
          minHeight: '240px',
          transform: isDragOver ? 'scale(1.01)' : 'scale(1)',
          boxShadow: isDragOver ? '0 10px 25px -5px rgba(123, 106, 230, 0.1), 0 8px 10px -6px rgba(123, 106, 230, 0.1)' : 'none',
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleChange}
          style={{ display: 'none' }}
          tabIndex={-1}
        />
        
        <div style={{
          padding: '20px',
          backgroundColor: isDragOver ? 'var(--color-primary)' : 'rgba(123, 106, 230, 0.1)',
          borderRadius: '50%',
          marginBottom: '20px',
          boxShadow: isDragOver ? '0 10px 15px -3px rgba(123, 106, 230, 0.3)' : 'none',
          transition: 'all 0.3s ease',
          color: isDragOver ? '#ffffff' : 'var(--color-primary)',
          transform: isDragOver ? 'translateY(-4px)' : 'translateY(0)',
        }}>
          <Upload size={36} strokeWidth={isDragOver ? 2.5 : 2} />
        </div>
        
        <span style={{ 
          fontSize: '1.125rem', 
          fontWeight: 600, 
          color: 'var(--color-text)', 
          textAlign: 'center',
          marginBottom: '8px',
          letterSpacing: '-0.01em'
        }}>
          {instructionText}
        </span>
        
        <span style={{ 
          fontSize: '0.875rem', 
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          maxWidth: '80%',
          lineHeight: '1.5'
        }}>
          {subInstructionText}
        </span>
      </div>
      
      {currentError && (
        <span style={{ 
          fontSize: '0.875rem', 
          color: 'var(--color-danger)', 
          fontWeight: 500,
          marginTop: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <X size={14} /> {currentError}
        </span>
      )}
    </div>
  );
}
