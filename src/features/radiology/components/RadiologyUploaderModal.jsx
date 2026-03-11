import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';
import { FileDropzone } from '../../../shared/components/FileDropzone';
import { ImagePreviewCard } from '../../../shared/components/ImagePreviewCard';

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

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError('');

    // Create a local preview URL
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
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
    <div className="modal-backdrop" style={{ 
      backgroundColor: 'rgba(15, 23, 42, 0.7)', 
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: 1000
    }}>
      <div className="modal" style={{ 
        maxWidth: '850px', 
        width: '95%',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1) inset' 
      }}>
        <div className="modal-header" style={{ 
          padding: '24px 32px', 
          borderBottom: '1px solid var(--color-border-light)',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Importer une Radiologie</h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>Ajoutez un fichier d'imagerie et complétez les informations cliniques.</p>
          </div>
          <button 
            className="icon-btn hover:bg-slate-100" 
            onClick={onClose}
            style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', color: 'var(--color-text-light)', transition: 'all 0.2s' }}
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff' }}>
          <div style={{ padding: '32px' }}>
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '32px',
              alignItems: 'start'
            }}>
              
              {/* LEFT COLUMN: File Preview & Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text)' }}>1. Fichier Source</h3>
                {preview && file ? (
                  <ImagePreviewCard 
                    file={file} 
                    previewUrl={preview} 
                    onRemove={clearFile}
                    onReplace={() => {
                      clearFile();
                      // Dropzone will show up automatically
                    }}
                  />
                ) : (
                  <FileDropzone 
                    onFileSelect={handleFileSelect}
                    accept="image/jpeg, image/png, application/dicom, .dcm"
                    maxSizeMB={20}
                    instructionText="Glissez votre imagerie ici"
                    subInstructionText="Formats supportés : JPG, PNG, DICOM (Max 20 MB)"
                  />
                )}
              </div>

              {/* RIGHT COLUMN: Metadata Form */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '20px',
                backgroundColor: 'var(--color-bg)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid var(--color-border-light)'
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px', color: 'var(--color-text)' }}>2. Informations Cliniques</h3>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 500 }}>Patient concerné <span style={{color: 'var(--color-danger)'}}>*</span></label>
                  <select 
                    className="form-select w-full" 
                    value={patientId} 
                    onChange={(e) => setPatientId(e.target.value)}
                    disabled={!!preSelectedPatientId}
                    required
                    style={{ backgroundColor: '#ffffff', height: '44px' }}
                  >
                    <option value="" disabled>Sélectionner un patient...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 500 }}>Type d'examen <span style={{color: 'var(--color-danger)'}}>*</span></label>
                    <select className="form-select w-full" value={type} onChange={(e) => setType(e.target.value)} required style={{ backgroundColor: '#ffffff', height: '44px' }}>
                      <option value="periapical">Rétro-alvéolaire</option>
                      <option value="panoramic">Panoramique</option>
                      <option value="cephalometric">Céphalométrique</option>
                      <option value="cbct">Cone Beam (CBCT)</option>
                      <option value="intraoral">Photo Intra-orale</option>
                      <option value="other">Autre doc.</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 500 }}>Date de l'acte <span style={{color: 'var(--color-danger)'}}>*</span></label>
                    <input 
                      type="date" 
                      className="form-input w-full" 
                      value={captureDate} 
                      onChange={(e) => setCaptureDate(e.target.value)}
                      required 
                      style={{ backgroundColor: '#ffffff', height: '44px' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 500 }}>Dents concernées <span style={{fontWeight: 'normal', color: 'var(--color-text-light)'}}>(Optionnel)</span></label>
                  <input 
                    type="text" 
                    className="form-input w-full" 
                    placeholder="Ex: 46, 47" 
                    value={linkedTeeth}
                    onChange={(e) => setLinkedTeeth(e.target.value)}
                    style={{ backgroundColor: '#ffffff', height: '44px' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 500 }}>Titre / Notes cliniques <span style={{fontWeight: 'normal', color: 'var(--color-text-light)'}}>(Optionnel)</span></label>
                  <input 
                    type="text" 
                    className="form-input w-full" 
                    placeholder="Contrôle post-op..." 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ backgroundColor: '#ffffff', height: '44px' }}
                  />
                </div>
              </div>
            </div>
          </div>        <div className="modal-footer" style={{ 
          padding: '24px 32px', 
          backgroundColor: '#f8fafc', 
          borderTop: '1px solid var(--color-border-light)',
          borderBottomLeftRadius: '20px', 
          borderBottomRightRadius: '20px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '16px',
        }}>
          <Button 
            type="button"
            variant="secondary" 
            onClick={onClose} 
            disabled={isUploading} 
            style={{ 
              padding: '12px 24px', 
              borderRadius: '12px', 
              fontWeight: 600,
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)'
            }}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            disabled={isUploading || !file} 
            style={{ 
              padding: '12px 32px', 
              borderRadius: '12px', 
              fontWeight: 600, 
              boxShadow: '0 4px 12px rgba(var(--color-primary-rgb), 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            {isUploading ? (
              <>
                <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Importation...
              </>
            ) : (
              'Importer la Radiologie'
            )}
          </Button>
        </div>
        </form>
      </div>
    </div>
  );
}
