import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../security/auth/useAuth';

// API Clients
import { patientsApi } from '../../../services/api/patientsApi';
import { appointmentsApi } from '../../../services/api/appointmentsApi';
import { billingApi } from '../../../services/api/billingApi';
import { radiologyApi } from '../../../services/api/radiologyApi';
import { recordsApi } from '../../../services/api/recordsApi';
import { dentalChartApi } from '../../../services/api/dentalChartApi';

// Components
import { Spinner } from '../../../shared/components/Spinner';
import { Alert } from '../../../shared/components/Alert';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { formatDate } from '../../../lib/utils';
import { formatMAD } from '../../../utils/currency';
import { Plus, CheckCircle, FileText, FileCheck, Activity, Clock, File, Stethoscope } from 'lucide-react';

export function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Data
  const [appointments, setAppointments] = useState([]);
  const [waitingRoom, setWaitingRoom] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [dentalChart, setDentalChart] = useState(null);

  // RBAC permissions
  const isAdmin = user?.role === 'admin';
  const isSecretary = user?.role === 'secretary';
  const isAssistant = user?.role === 'assistant';

  const canViewDentalChart = isAdmin || isAssistant;
  const canViewBilling = isAdmin || isSecretary;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const p = await patientsApi.getById(id);
      setPatient(p);

      // Load all related data
      const [appts, wr, inv, imgs, docs, chart] = await Promise.all([
        appointmentsApi.getByPatient(id),
        appointmentsApi.getWaitingRoomByPatient(id),
        billingApi.getByPatient(id),
        radiologyApi.getAll(id),
        recordsApi.getAll(id),
        dentalChartApi.getChartByPatient(id).catch(() => null) // May not exist yet
      ]);

      setAppointments(appts || []);
      setWaitingRoom(wr || []);
      setInvoices(inv || []);
      setImages(imgs || []);
      setDocuments(docs || []);
      setDentalChart(chart);

    } catch (err) {
      setError(t('common.error'));
      if (err.status === 404) {
        navigate('/patients');
      }
    } finally {
      setLoading(false);
    }
  }, [id, t, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Actions
  const handleCheckIn = async (appointment) => {
    try {
      await appointmentsApi.checkIn(patient.id, `${patient.firstName} ${patient.lastName}`, appointment.time, appointment.id);
      loadData();
    } catch {
      setError(t('common.error'));
    }
  };

  const handleUpdateWaitingRoomStatus = async (wrId, status) => {
    try {
      await appointmentsApi.updateWaitingRoomStatus(wrId, status);
      loadData();
    } catch {
      setError(t('common.error'));
    }
  };

  const handleCreateInvoice = async (wrEntry) => {
    try {
      await billingApi.create({
        patientId: patient.id,
        patientName: patient.firstName + ' ' + patient.lastName,
        items: [{ description: 'Consultation', amount: 50 }], // Default basic invoice
        total: 50
      });
      // Optionally remove from waiting room
      await appointmentsApi.checkOut(wrEntry.id);
      
      // Navigate to billing tab
      setActiveTab('billing');
      loadData();
    } catch {
      setError(t('common.error'));
    }
  };

  if (loading) return <Spinner />;
  if (!patient) return <Alert type="error" message={"Patient non trouvé."} />;

  return (
    <div>
      {/* HEADER */}
      <div className="page-header" style={{ marginBottom: '10px' }}>
        <div>
          <h2 className="page-header__title">
            Dossier de {patient.firstName} {patient.lastName}
          </h2>
          <p className="page-header__subtitle">
            {formatDate(patient.dateOfBirth)} • {patient.phone} • {patient.email}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/patients')}>
          Retour aux patients
        </Button>
      </div>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
        {patient.address} {patient.notes && `— ${patient.notes}`}
      </p>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px', overflowX: 'auto' }}>
        <Button variant={activeTab === 'appointments' ? 'primary' : 'ghost'} onClick={() => setActiveTab('appointments')}>
          <Clock size={16} /> Rendez-vous
        </Button>
        <Button variant={activeTab === 'waitingRoom' ? 'primary' : 'ghost'} onClick={() => setActiveTab('waitingRoom')}>
          <Activity size={16} /> Salle d'attente
        </Button>
        <Button variant={activeTab === 'dentalChart' ? 'primary' : 'ghost'} onClick={() => setActiveTab('dentalChart')}>
          <Stethoscope size={16} /> Schéma dentaire
        </Button>
        <Button variant={activeTab === 'billing' ? 'primary' : 'ghost'} onClick={() => setActiveTab('billing')}>
          <FileText size={16} /> Facturation
        </Button>
        <Button variant="ghost" onClick={() => navigate(`/patients/${patient.id}/prescriptions`)}>
          <FileCheck size={16} /> Ordonnances
        </Button>
        <Button variant="ghost" onClick={() => navigate(`/patients/${patient.id}/medical-records`)}>
          <FileText size={16} /> Dossier Médical
        </Button>
        <Button variant={activeTab === 'documents' ? 'primary' : 'ghost'} onClick={() => setActiveTab('documents')}>
          <File size={16} /> Radios / Documents
        </Button>
      </div>

      {/* TAB CONTENT */}
      
      {/* 1. APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <Card title="Rendez-vous">
          {appointments.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id}>
                    <td>{formatDate(a.date)}</td>
                    <td>{a.time}</td>
                    <td>{t(`appointmentTypes.${a.type}`, a.type)}</td>
                    <td>
                      <span className={`badge badge--${a.status === 'scheduled' ? 'info' : 'success'}`}>
                        {t(`statuses.${a.status}`, a.status)}
                      </span>
                    </td>
                    <td>
                      {a.status === 'scheduled' && (
                        <Button size="sm" onClick={() => handleCheckIn(a)}>
                          Check-in
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
             <p className="empty-state">Aucun rendez-vous trouvé.</p>
          )}
        </Card>
      )}

      {/* 2. WAITING ROOM */}
      {activeTab === 'waitingRoom' && (
        <Card title="Visites en cours">
          {waitingRoom.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Heure RDV</th>
                  <th>Arrivé à</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {waitingRoom.map(w => (
                  <tr key={w.id}>
                    <td>{w.appointmentTime}</td>
                    <td>{new Date(w.checkedInAt).toLocaleTimeString()}</td>
                    <td>
                       <span className={`badge badge--${w.status === 'waiting' ? 'warning' : 'info'}`}>
                        {w.status === 'waiting' ? 'En attente' : 'En consultation'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {w.status === 'waiting' && canViewDentalChart && (
                          <Button size="sm" variant="secondary" onClick={() => handleUpdateWaitingRoomStatus(w.id, 'consultation')}>
                            Appeler
                          </Button>
                        )}
                        {w.status === 'consultation' && canViewDentalChart && (
                          <Button size="sm" variant="success" onClick={() => handleUpdateWaitingRoomStatus(w.id, 'done')}>
                            Terminer consultation
                          </Button>
                        )}
                        {w.status === 'done' && canViewBilling && (
                          <Button size="sm" variant="primary" onClick={() => handleCreateInvoice(w)}>
                            <Plus size={14}/> Créer facture
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">Le patient n'est pas dans la salle d'attente.</p>
          )}
        </Card>
      )}

      {/* 3. DENTAL CHART */}
      {activeTab === 'dentalChart' && (
        <Card title="Schéma dentaire">
          {!canViewDentalChart ? (
            <Alert type="warning" message="Accès refusé. Réservé aux administrateurs et assistants." />
          ) : (
             <div>
                {dentalChart ? (
                  <p>Résumé: {dentalChart.teeth.length} dents enregistrées.</p>
                ) : (
                  <p>Aucun schéma dentaire existant. Vous pouvez en créer un dans le module clinique principal.</p>
                )}
                <Button variant="secondary" onClick={() => navigate('/dental-chart')}>
                   Aller au module complet
                </Button>
             </div>
          )}
        </Card>
      )}

      {/* 4. BILLING */}
      {activeTab === 'billing' && (
        <Card title="Factures">
           {!canViewBilling ? (
            <Alert type="warning" message="Accès refusé. Réservé aux administrateurs et secrétaires." />
           ) : (
             invoices.length > 0 ? (
               <table className="data-table">
                 <thead>
                   <tr>
                     <th>Date</th>
                     <th>Montant</th>
                     <th>Statut</th>
                   </tr>
                 </thead>
                 <tbody>
                   {invoices.map(i => (
                     <tr key={i.id}>
                       <td>{formatDate(i.issuedAt || i.createdAt)}</td>
                       <td>{formatMAD(i.total)}</td>
                       <td>
                         <span className={`badge badge--${i.status === 'paid' ? 'success' : 'warning'}`}>
                            {i.status === 'paid' ? 'Payée' : 'En attente'}
                          </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             ) : (
               <p className="empty-state">Aucune facture trouvée.</p>
             )
           )}
        </Card>
      )}

      {/* 5. DOCUMENTS & RADIOLOGY */}
      {activeTab === 'documents' && (
        <Card title="Radios et Documents">
           <div style={{ padding: '16px', backgroundColor: 'var(--color-bg)', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--color-border)' }}>
             <h4 style={{ margin: '0 0 8px 0' }}>Workspace Radiologique</h4>
             <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
               Accédez à l'espace complet d'imagerie clinique pour visualiser, analyser et annoter les radiographies de ce patient.
             </p>
             <Button onClick={() => navigate(`/patients/${patient.id}/radiology`)}>
                Ouvrir le Workspace
             </Button>
           </div>

           <h4 style={{ marginBottom: '10px' }}>Imagerie Récente</h4>
           {images.length > 0 ? (
             <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                {images.map(img => (
                  <li key={img.id} style={{ marginBottom: '4px' }}>
                    <strong>{img.category}</strong>: <span style={{ color: 'var(--color-text-secondary)' }}>{img.diagnosis || 'Aucune description'}</span>
                  </li>
                ))}
             </ul>
           ) : <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>Aucune imagerie radiologique enregistrée.</p>}

           <h4 style={{ marginBottom: '10px' }}>Autres Documents (PDF, Fichiers)</h4>
           {documents.length > 0 ? (
             <ul style={{ paddingLeft: '20px' }}>
                {documents.map(doc => <li key={doc.id}>{doc.title} ({doc.category})</li>)}
             </ul>
           ) : <p style={{ color: 'var(--color-text-secondary)' }}>Aucun document administratif.</p>}
        </Card>
      )}

    </div>
  );
}
