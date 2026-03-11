import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/components/Button';
import { Upload, X, Maximize2 } from 'lucide-react';
import { useRadiology } from '../context/RadiologyContext';
import { useAuth } from '../../../security/auth/useAuth';
import { RadiologyUploaderModal } from './RadiologyUploaderModal';

export function RadiologyTopBar({ patients, globalSelectedPatientId, onGlobalPatientChange }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { activeImage, setActiveImage, uploadImage } = useRadiology();
  const [showUploader, setShowUploader] = useState(false);

  const canUpload = user?.role === 'admin' || user?.role === 'assistant' || user?.role === 'secretary';

  return (
    <div 
      className="page-header" 
      style={{ 
        marginBottom: '24px', 
        paddingBottom: '20px', 
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div>
        <h2 className="page-header__title" style={{ fontSize: '1.75rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Workspace Radiologique
        </h2>
        <p className="page-header__subtitle" style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Visualisation et diagnostic clinique
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {/* If an image is open, we show a 'Close Viewer' button instead of the patient selector to keep focus */}
        {activeImage ? (
          <Button variant="secondary" onClick={() => setActiveImage(null)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontWeight: 500 }}>
            <X size={18} /> Retour à la galerie
          </Button>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Sélection du Patient
              </label>
              <select 
                className="form-select" 
                value={globalSelectedPatientId} 
                onChange={(e) => onGlobalPatientChange(e.target.value)} 
                style={{ 
                  width: '260px', 
                  backgroundColor: 'var(--color-bg-card)', 
                  borderColor: 'var(--color-border)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  color: 'var(--color-text)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(var(--color-primary-rgb), 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                }}
              >
                <option value="" disabled>Choisir un patient...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
            </div>
            
            {canUpload && (
               <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: '2px' }}>
                 <Button onClick={() => setShowUploader(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontWeight: 500, boxShadow: '0 4px 6px rgba(var(--color-primary-rgb), 0.2)' }}>
                   <Upload size={18} /> Importer
                 </Button>
               </div>
            )}
            
            {showUploader && (
              <RadiologyUploaderModal
                patients={patients}
                preSelectedPatientId={globalSelectedPatientId}
                onUpload={uploadImage}
                onClose={() => setShowUploader(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
