import { useRadiology } from '../context/RadiologyContext';
import { RadiologySidebar } from './SidebarFilters/RadiologySidebar';
import { ImageGallery } from './Gallery/ImageGallery';
import { ImageWorkspace } from './Viewer/ImageWorkspace';
import { MetadataSidebar } from './MetadataPanel/MetadataSidebar';
import { Spinner } from '../../../shared/components/Spinner';

export function RadiologyLayout() {
  const { selectedPatientId, activeImage, loading, error, loadImages } = useRadiology();

  if (!selectedPatientId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
        <h3>Aucun patient sélectionné</h3>
        <p>Veuillez sélectionner un patient dans la barre en haut pour voir son espace radiologique.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 180px)', // Adjust based on header height 
      gap: '16px',
      overflow: 'hidden'
    }}>
      {/* LEFT: Filters Spine */}
      <div style={{ width: '250px', flexShrink: 0, overflowY: 'auto' }}>
        <RadiologySidebar />
      </div>

      {/* CENTER: Canvas (Gallery or Viewer) */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: activeImage ? '#000' : 'transparent', borderRadius: '8px' }}>
        {error && (
          <div style={{ padding: '16px', backgroundColor: '#FEF2F2', color: '#991B1B', margin: '16px', borderRadius: '8px' }}>
            {error}
            <button onClick={loadImages} style={{ marginLeft: '10px', textDecoration: 'underline', background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer' }}>
              Réessayer
            </button>
          </div>
        )}
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
            <Spinner />
          </div>
        ) : (
          activeImage ? <ImageWorkspace /> : <ImageGallery />
        )}
      </div>

      {/* RIGHT: Metadata Context Panel (Only when an image is active) */}
      {activeImage && (
        <div style={{ width: '320px', flexShrink: 0, overflowY: 'auto', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
          <MetadataSidebar />
        </div>
      )}
    </div>
  );
}
