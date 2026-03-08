import { useRadiology } from '../../context/RadiologyContext';
import { Calendar, Tag } from 'lucide-react';
import { formatDate } from '../../../../lib/utils';

export function ImageGallery() {
  const { images, setActiveImage } = useRadiology();

  if (images.length === 0) {
    return (
      <div className="empty-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-text)' }}>Aucun résultat</h3>
        <p style={{ margin: 0 }}>Aucune image ne correspond à ces filtres pour le moment.</p>
      </div>
    );
  }

  // Group images by month/year for the chronological spine effect
  const groupedImages = images.reduce((acc, img) => {
    // For MVP, simple date extraction
    const date = new Date(img.capturedAt || img.uploadedAt || img.createdAt);
    const key = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(img);
    return acc;
  }, {});

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
      {Object.entries(groupedImages).map(([monthYear, groupImages]) => (
        <div key={monthYear} style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            textTransform: 'capitalize', 
            paddingBottom: '8px', 
            borderBottom: '2px solid var(--color-bg)',
            marginBottom: '16px',
            position: 'sticky',
            top: '-16px', // Account for wrapper padding
            backgroundColor: 'var(--color-bg-card)',
            zIndex: 10
          }}>
            {monthYear}
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '16px' 
          }}>
            {groupImages.map(img => (
              <ImageThumbnailCard 
                key={img.id} 
                image={img} 
                onClick={() => setActiveImage(img)} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ImageThumbnailCard({ image, onClick }) {
  // Use a pseudo-placeholder if no real image exists
  const bgImage = image.imageUrl || image.fileUrl || `https://via.placeholder.com/400x300.png?text=${image.type}`;
  
  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#fff',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseOver={(e) => {
         e.currentTarget.style.transform = 'translateY(-2px)';
         e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseOut={(e) => {
         e.currentTarget.style.transform = 'translateY(0)';
         e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ height: '160px', width: '100%', backgroundColor: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>
        <img 
          src={bgImage} 
          alt={image.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300.png?text=Erreur+Image'; }}
        />
        {/* Type Badge */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          fontSize: '0.7rem',
          padding: '2px 6px',
          borderRadius: '4px',
          textTransform: 'uppercase',
          fontWeight: 600
        }}>
          {image.type}
        </div>
      </div>
      
      <div style={{ padding: '12px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {image.title || 'Image S/T'}
        </h4>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: '4px' }}>
          <Calendar size={12} />
          {formatDate(image.capturedAt || image.uploadedAt || image.createdAt)}
        </div>
        
        {image.linkedTeeth && image.linkedTeeth.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: '0.8rem' }}>
            <Tag size={12} />
            Dents: {image.linkedTeeth.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
