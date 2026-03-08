import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { patientsApi } from '../../../services/api/patientsApi';
import { RadiologyProvider } from '../context/RadiologyContext';
import { RadiologyLayout } from '../components/RadiologyLayout';
import { RadiologyTopBar } from '../components/RadiologyTopBar';
import { Spinner } from '../../../shared/components/Spinner';

export function RadiologyPage() {
  const { t } = useTranslation();
  const { id: urlPatientId } = useParams(); // Grab from /patients/:id/radiology if active
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPatientId, setSelectedPatientId] = useState(urlPatientId || '');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await patientsApi.getAll();
        setPatients(data);
        
        // If a patient ID came from the URL, ensure it exists in the data, otherwise default to first.
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
  }, [urlPatientId]); // Re-run if URL changes

  if (loading) return <Spinner />;

  return (
    <RadiologyProvider initialPatientId={selectedPatientId}>
      {/* We pass patients and explicit setters so the TopBar can render the select dropdown and intercept changes */}
      <RadiologyTopBar 
        patients={patients} 
        globalSelectedPatientId={selectedPatientId}
        onGlobalPatientChange={setSelectedPatientId}
      />
      <RadiologyLayout />
    </RadiologyProvider>
  );
}
