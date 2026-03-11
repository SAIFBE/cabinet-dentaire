import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { patientsApi } from '../../../services/api/patientsApi';
import { PatientForm } from '../components/PatientForm';
import { Button } from '../../../shared/components/Button';
import { Spinner } from '../../../shared/components/Spinner';
import { Alert } from '../../../shared/components/Alert';
import { Card } from '../../../shared/components/Card';
import { ResponsiveTableWrapper } from '../../../shared/components/ResponsiveTableWrapper';
import { formatDate } from '../../../lib/utils';
import { Plus, X, UserPlus, Users, FileText, Trash2 } from 'lucide-react';

export function PatientsPage() {
  const { t } = useTranslation();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadPatients = useCallback(async () => {
    try {
      setError('');
      const data = await patientsApi.getAll();
      setPatients(data);
    } catch (err) {
      setError(t('patients.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadPatients(); }, [loadPatients]);

  const handleAdd = async (data) => {
    try {
      await patientsApi.create(data);
      setShowModal(false);
      loadPatients();
    } catch { setError(t('patients.addError')); }
  };

  const handleEdit = async (data) => {
    try {
      await patientsApi.update(editPatient.id, data);
      setEditPatient(null);
      setShowModal(false);
      loadPatients();
    } catch { setError(t('patients.updateError')); }
  };

  const handleDelete = async (patient) => {
    console.log("CONFIRMED DELETE", patient.id);
    const confirmed = window.confirm(
      `Supprimer ${patient.firstName} ${patient.lastName} ? Cette action est irréversible.`
    );
    if (!confirmed) return;

    try {
      console.log("CALLING patientsApi.delete", patient.id);
      setDeletingId(patient.id);
      
      const res = await patientsApi.remove(patient.id);
      console.log("DELETE RESPONSE", res);
      
      // Optimistic: remove from local state immediately
      setPatients((prev) => prev.filter((p) => String(p.id) !== String(patient.id)));
      
      // Also refetch to be sure
      await loadPatients();
    } catch (err) {
      console.error('[Delete Patient Error]', err);
      // fallback to status if available
      const status = err?.status || err?.response?.status;
      setError(`Erreur lors de la suppression du patient. (Status: ${status || 'Inconnu'})`);
    } finally {
      setDeletingId(null);
    }
  };

  const openAdd = () => { setEditPatient(null); setShowModal(true); };
  const openEdit = (patient) => { setEditPatient(patient); setShowModal(true); };
  const closeModal = () => { setEditPatient(null); setShowModal(false); };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">{t('patients.title')}</h2>
          <p className="page-header__subtitle">{t('patients.subtitle')}</p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} /> {t('patients.addPatient')}
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Card>
        {patients.length > 0 ? (
          <ResponsiveTableWrapper>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('common.name')}</th>
                  <th>{t('common.email')}</th>
                  <th>{t('common.phone')}</th>
                  <th>{t('patients.dateOfBirth')}</th>
                  <th>{t('patients.created')}</th>
                  <th>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.firstName} {p.lastName}</td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td>{formatDate(p.dateOfBirth)}</td>
                    <td>{formatDate(p.createdAt)}</td>
                    <td>
                      <div className="patient-actions">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(p)}
                          disabled={deletingId === p.id}
                          style={{ color: 'var(--color-danger, #ef4444)' }}
                        >
                          <Trash2 size={14} />
                        </Button>
                        <Link
                          to={`/patients/${p.id}`}
                          className="patient-pdf-link"
                          title="Voir le dossier complet"
                        >
                          <FileText size={15} /> Dossier
                        </Link>
                        <Link
                          to={`/patients/${p.id}/feuille-soins`}
                          className="patient-pdf-link"
                          title="Feuille de soins (CNSS/CNOPS)"
                        >
                          <FileText size={15} /> CNSS
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResponsiveTableWrapper>
        ) : (
          <div className="empty-state">
            <Users size={40} className="empty-state__icon" />
            <p className="empty-state__title">{t('patients.noPatients')}</p>
            <p className="empty-state__text">{t('patients.noPatientsSub')}</p>
          </div>
        )}
      </Card>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">
                {editPatient ? t('patients.editPatient') : t('patients.newPatient')}
              </h3>
              <button className="modal__close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal__body">
              <PatientForm
                defaultValues={editPatient}
                onSubmit={editPatient ? handleEdit : handleAdd}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
