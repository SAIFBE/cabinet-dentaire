import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';

export function RadiologyUploaderModal({ patients, preSelectedPatientId, onUpload, onClose }) {
  const { t } = useTranslation();
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // Form State
  const [patientId, setPatientId] = useState(preSelectedPatientId || '');
  const [type, setType] = useState('periapical');
  const [captureDate, setCaptureDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [linkedTeeth, setLinkedTeeth] = useState('');
  
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 20 * 1024 * 1024) {
      setError("Le fichier dépasse la taille maximale autorisée de 20MB.");
      return;
    }

    setFile(selectedFile);
    setError('');

    // Create a local preview URL
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Veuillez sélectionner un fichier à uploader.");
      return;
    }
    if (!patientId) {
      setError("Veuillez sélectionner un patient.");
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const selectedPatient = patients.find(p => p.id === patientId);
      
      // Parse linked teeth into an array
      const parsedTeeth = linkedTeeth
        .split(',')
        .map(t => t.trim())
        .filter(t => t);

      const payload = {
        patientId,
        patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : 'Inconnu',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        // Mock generating an object URL or data string (in reality this is handled by a storage bucket)
        fileUrl: preview, 
        category: type, // API uses category atm
        type: type, // New spec
        title: title || file.name,
        capturedAt: captureDate,
        tooth: parsedTeeth[0] || null, // API legacy support
        linkedTeeth: parsedTeeth, // New spec
        tags: [],
      };

      await onUpload(payload);
      onClose();
    } catch (err) {
      setError("Erreur lors de l'upload de l'image.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: '600px', width: '90%' }}>
        <div className="modal-header">
          <h2>Importer une Radiologie</h2>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* LEFT COLUMN: File Preview & Selection */}
            <div>
              <div 
                style={{ 
                  height: '200px', 
                  border: '2px dashed var(--color-border)', 
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: preview ? '#000' : 'var(--color-bg)',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '10px'
                }}
              >
                {preview ? (
                  <img src={preview} alt="Aperçu" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <>
                    <Upload size={32} color="var(--color-text-secondary)" style={{ marginBottom: '10px' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Cliquez pour sélectionner</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Max 20MB (JPG, PNG, DICOM)</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, application/dicom, .dcm"
                  onChange={handleFileChange}
                  style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' 
                  }}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Metadata Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label>Patient *</label>
                <select 
                  className="form-select" 
                  value={patientId} 
                  onChange={(e) => setPatientId(e.target.value)}
                  disabled={!!preSelectedPatientId}
                  required
                >
                  <option value="" disabled>Sélectionner un patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Type d'image *</label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)} required>
                  <option value="periapical">Rétro-alvéolaire</option>
                  <option value="panoramic">Panoramique</option>
                  <option value="cephalometric">Céphalométrique</option>
                  <option value="cbct">Cone Beam (CBCT)</option>
                  <option value="intraoral">Photo Intra-orale</option>
                  <option value="other">Autre / Document</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date de capture *</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={captureDate} 
                  onChange={(e) => setCaptureDate(e.target.value)}
                  required 
                />
              </div>
            </div>
            
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '16px 0' }} />

          {/* BOTTOM ROW: Optional Clinical Data */}
          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--color-text-secondary)' }}>Détails Cliniques (Optionnel)</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Titre / Description courte</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Contrôle post-op..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Dents associées (Séparées par des virgules)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: 46, 47" 
                  value={linkedTeeth}
                  onChange={(e) => setLinkedTeeth(e.target.value)}
                />
              </div>
            </div>
          </div>

        </form>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose} disabled={isUploading}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={isUploading || !file}>
            {isUploading ? 'Importation en cours...' : 'Importer et Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
}
