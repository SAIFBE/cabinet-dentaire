import { useTranslation } from 'react-i18next';
import { FileText, Folder, Clock } from 'lucide-react';

const CATEGORY_COLORS = {
  Radiology: { bg: 'var(--color-info-bg)', color: 'var(--color-info)' },
  Prescriptions: { bg: 'var(--color-success-bg)', color: 'var(--color-success)' },
  Treatments: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
  Notes: { bg: '#f1f5f9', color: 'var(--color-text-secondary)' },
};

export function PatientHistoryTimeline({ documents }) {
  const { t } = useTranslation();

  if (!documents.length) {
    return (
      <div className="empty-state" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '48px' }}>
        <FileText size={48} style={{ color: 'var(--color-text-light)', marginBottom: '12px' }} />
        <p className="empty-state__title">{t('medicalRecords.noDocuments')}</p>
        <p className="empty-state__text">{t('medicalRecords.noDocumentsSub')}</p>
      </div>
    );
  }

  const sorted = [...documents].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

  return (
    <div className="timeline">
      {sorted.map((doc) => {
        const catStyle = CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.Notes;
        return (
          <div key={doc.id} className="timeline__item">
            <div className="timeline__dot" style={{ background: catStyle.color }} />
            <div className="timeline__content">
              <div className="timeline__header">
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{doc.title}</span>
                <span className="badge" style={{ background: catStyle.bg, color: catStyle.color }}>
                  <Folder size={11} style={{ marginRight: '3px' }} />
                  {t(`docCategories.${doc.category}`, doc.category)}
                </span>
              </div>
              {doc.description && <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '4px 0' }}>{doc.description}</p>}
              {doc.previewUrl && (
                <img src={doc.previewUrl} alt={doc.fileName} style={{ marginTop: 6, maxWidth: 120, maxHeight: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--color-border)' }} />
              )}
              <div className="timeline__meta">
                <span><FileText size={12} /> {doc.fileName}</span>
                <span><Clock size={12} /> {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}</span>
                <span>{t('common.by')} {doc.uploadedBy}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
