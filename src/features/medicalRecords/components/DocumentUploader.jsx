import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';
import { ImageFileInput } from '../../../shared/components/ImageFileInput';
import { X, Upload } from 'lucide-react';

const CATEGORIES = ['Radiology', 'Prescriptions', 'Treatments', 'Notes'];

/** Convert a File to a base64 data URL */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function DocumentUploader({ patients, onUpload, onClose }) {
  const { t } = useTranslation();
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Notes');
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedPatient = patients.find((p) => p.id === patientId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!patientId || !title || !file) { setError(t('medicalRecords.requiredFields')); return; }
    setLoading(true);
    try {
      const previewUrl = await fileToDataUrl(file);
      await onUpload({
        patientId,
        patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : '',
        title, category,
        fileName: file.name, fileType: file.type, fileSize: file.size, previewUrl,
        description,
      });
      onClose();
    } catch { setError(t('medicalRecords.uploadError')); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{t('medicalRecords.uploadDocument')}</h3>
          <button className="modal__close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal__body">
          {error && <Alert type="error" message={error} />}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('common.patient')}</label>
              <select className="form-select" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('medicalRecords.documentTitle')}</label>
                <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('medicalRecords.documentTitlePlaceholder')} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('common.category')}</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{t(`docCategories.${c}`, c)}</option>)}
                </select>
              </div>
            </div>
            <ImageFileInput
              label={t('radiology.fileName')}
              accept="image/*"
              onChange={setFile}
            />
            <div className="form-group">
              <label className="form-label">{t('common.description')}</label>
              <textarea className="form-input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('medicalRecords.descriptionPlaceholder')} />
            </div>
            <div className="modal__footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
              <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
              <Button type="submit" loading={loading}><Upload size={16} /> {t('common.upload')}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
