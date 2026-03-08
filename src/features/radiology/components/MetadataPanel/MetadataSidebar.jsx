import { useState, useEffect } from 'react';
import { useRadiology } from '../../context/RadiologyContext';
import { useAuth } from '../../../../security/auth/useAuth';
import { formatDate } from '../../../../lib/utils';
import { Button } from '../../../../shared/components/Button';
import { Clock, User, Tag, Trash2, FileText, ChevronRight } from 'lucide-react';

export function MetadataSidebar() {
  const { activeImage, deleteImage, setActiveImage } = useRadiology();
  const { user } = useAuth();
  
  // RBAC checks
  const canEditNotes = user?.role === 'admin' || user?.role === 'dentist';
  const canDelete = user?.role === 'admin';

  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync internal state when activeImage changes
  useEffect(() => {
    if (activeImage) {
      setNotes(activeImage.notes || '');
    }
  }, [activeImage]);

  if (!activeImage) return null;

  const handleSaveNotes = async () => {
    if (!canEditNotes) return;
    setSaving(true);
    try {
      // MOCK API Call to update the image. For now, we simulate a delay.
      await new Promise(resolve => setTimeout(resolve, 600));
      // In a real app we would dispatch an update action to RadiologyContext
      alert('Note clinique sauvegardée ! (Mock UI)');
    } catch (e) {
       console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette image radiologique ? Cette action est irréversible.")) {
      await deleteImage(activeImage.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header Info */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
           <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-primary)' }}>
             Information Image
           </h3>
           <span style={{ 
             fontSize: '0.7rem', 
             backgroundColor: 'var(--color-bg-hover)', 
             padding: '4px 8px', 
             borderRadius: '12px',
             textTransform: 'uppercase',
             fontWeight: 600
           }}>
             {activeImage.type}
           </span>
        </div>
        
        <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
          {activeImage.title || 'Sans titre'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={14} />
            <span>Prise le: {formatDate(activeImage.capturedAt || activeImage.uploadedAt)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <User size={14} />
             <span>Transmis par: {activeImage.uploadedBy}</span>
          </div>
        </div>
      </div>

      {/* Linked Teeth Section */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
           <Tag size={16} color="var(--color-text-secondary)" />
           <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Dents associées</h4>
        </div>
        {activeImage.linkedTeeth && activeImage.linkedTeeth.length > 0 ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {activeImage.linkedTeeth.map(t => (
              <span key={t} style={{ 
                backgroundColor: 'var(--color-primary-light)', 
                color: 'var(--color-primary)', 
                padding: '4px 10px', 
                borderRadius: '16px', 
                fontSize: '0.85rem', 
                fontWeight: 600 
              }}>
                {t}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
            Aucune dent spécifique associée.
          </p>
        )}
      </div>

      {/* Clinical Notes (RBAC enforced) */}
      <div style={{ padding: '20px', flex: 1, borderBottom: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
           <FileText size={16} color="var(--color-text-secondary)" />
           <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Note Diagnostique</h4>
        </div>
        
        <textarea 
          className="form-input"
          style={{ 
            flex: 1, 
            width: '100%', 
            resize: 'none', 
            padding: '12px', 
            minHeight: '120px', 
            marginBottom: '12px',
            backgroundColor: canEditNotes ? 'var(--color-bg)' : 'var(--color-bg-hover)',
            cursor: canEditNotes ? 'text' : 'not-allowed'
          }}
          placeholder={canEditNotes ? "Ajouter vos observations cliniques ici..." : "Notes cliniques indisponibles pour votre rôle."}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={!canEditNotes}
        />
        
        {canEditNotes && (
          <Button 
            onClick={handleSaveNotes} 
            disabled={saving || notes === (activeImage.notes || '')}
            style={{ alignSelf: 'flex-end' }}
            size="sm"
          >
            {saving ? 'Sauvegarde...' : 'Enregistrer la note'}
          </Button>
        )}
      </div>

      {/* Actions & Links */}
      <div style={{ padding: '20px', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
         <button 
           className="action-link-btn"
           style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', textAlign: 'left',  color: 'var(--color-text)' }}
           onClick={() => alert('Future Feature: Link to Medical Record')}
         >
           <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Créer un événement médical</span>
           <ChevronRight size={16} color="var(--color-text-secondary)" />
         </button>
         
         {canDelete && (
           <Button variant="danger" size="sm" onClick={handleDelete} style={{ marginTop: '10px' }}>
              <Trash2 size={14} /> Supprimer l'image
           </Button>
         )}
      </div>
    </div>
  );
}
