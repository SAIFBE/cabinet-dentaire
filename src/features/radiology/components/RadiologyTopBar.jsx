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
    <div className="page-header" style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
      <div>
        <h2 className="page-header__title">Workspace Radiologique</h2>
        <p className="page-header__subtitle">Visualisation et diagnostic clinique</p>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* If an image is open, we show a 'Close Viewer' button instead of the patient selector to keep focus */}
        {activeImage ? (
          <Button variant="secondary" onClick={() => setActiveImage(null)}>
            <X size={16} /> Retour à la galerie
          </Button>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                Patient
              </label>
              <select 
                className="form-select" 
                value={globalSelectedPatientId} 
                onChange={(e) => onGlobalPatientChange(e.target.value)} 
                style={{ width: '220px', backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
              >
                <option value="" disabled>Sélectionner un patient...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
            </div>
            
            {canUpload && (
               <Button onClick={() => setShowUploader(true)}>
                 <Upload size={16} /> Importer
               </Button>
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
