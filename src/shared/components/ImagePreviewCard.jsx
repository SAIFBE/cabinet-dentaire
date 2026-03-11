import { File as FileIcon, X, RefreshCw } from 'lucide-react';
import { formatBytes } from '../../lib/utils';

export function ImagePreviewCard({ 
  file, 
  previewUrl, 
  onRemove, 
  onReplace 
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      backgroundColor: 'var(--color-bg-card)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.025)',
      transition: 'box-shadow 0.2s ease',
    }}>
      {/* Image Preview Area */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '240px',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border-light)'
      }}>
        {/* Checkered background pattern for transparent PNGs */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.5,
          backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          zIndex: 0
        }} />

        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Preview" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              zIndex: 1
            }} 
          />
        ) : (
          <div style={{ zIndex: 1, color: 'var(--color-text-light)' }}>
            <FileIcon size={56} strokeWidth={1.5} />
          </div>
        )}

        {/* Action Overlay */}
        <div 
          className="preview-overlay"
          style={{
            position: 'absolute',
            top: 0, right: 0, padding: '16px',
            display: 'flex', gap: '8px',
            zIndex: 10
          }}
        >
          {onReplace && (
            <button 
              onClick={(e) => { e.preventDefault(); onReplace(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '100px',
                color: 'var(--color-text)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
              }}
              className="hover:bg-white hover:scale-105 active:scale-95"
              title="Remplacer le fichier"
            >
              <RefreshCw size={14} /> Remplacer
            </button>
          )}
        </div>
      </div>

      {/* File Info Area */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        backgroundColor: 'var(--color-bg-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflow: 'hidden' }}>
          <div style={{ 
            padding: '12px', 
            backgroundColor: 'var(--color-primary-50)', 
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileIcon size={24} strokeWidth={2} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              color: 'var(--color-text)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '2px',
              letterSpacing: '-0.01em'
            }}>
              {file?.name || "Fichier sélectionné"}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              {file?.size ? formatBytes(file.size) : 'Taille inconnue'}
            </div>
          </div>
        </div>

        {onRemove && (
          <button 
            onClick={(e) => { e.preventDefault(); onRemove(); }}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              color: 'var(--color-danger)', 
              backgroundColor: '#FEF2F2',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            className="hover:bg-red-100 active:bg-red-200"
            title="Supprimer"
            aria-label="Supprimer le fichier"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
