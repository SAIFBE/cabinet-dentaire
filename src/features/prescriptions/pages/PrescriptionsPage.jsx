import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { patientsApi } from '../../../services/api/patientsApi';
import { PrescriptionProvider } from '../context/PrescriptionContext';
import { PrescriptionLayout } from '../components/PrescriptionLayout';
import { Spinner } from '../../../shared/components/Spinner';

export function PrescriptionsPage() {
  const { id: urlPatientId } = useParams();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // We manage the patient selection here at the top level so we can pass it into the provider
  const [selectedPatientId, setSelectedPatientId] = useState(urlPatientId || '');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await patientsApi.getAll();
        setPatients(data);
        
        if (urlPatientId) {
           const exists = data.find(p => p.id === urlPatientId);
           if (exists) setSelectedPatientId(urlPatientId);
        } else if (data.length > 0 && !selectedPatientId) {
           setSelectedPatientId(data[0].id);
        }
      } catch (err) { 
        console.error(err);
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, [urlPatientId]);

  if (loading) return <Spinner />;

  return (
    <PrescriptionProvider initialPatientId={selectedPatientId}>
      {/* Top Bar for global patient selection */}
      <div className="page-header no-print" style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
        <div>
          <h2 className="page-header__title">Ordonnances</h2>
          <p className="page-header__subtitle">Création et historique des prescriptions</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
             Patient
          </label>
          <select 
            className="form-select" 
            value={selectedPatientId} 
            onChange={(e) => setSelectedPatientId(e.target.value)} 
            style={{ width: '250px', backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
          >
            <option value="" disabled>Sélectionner un patient...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
          </select>
        </div>
      </div>

      <PrescriptionLayout />
    </PrescriptionProvider>
  );
}
