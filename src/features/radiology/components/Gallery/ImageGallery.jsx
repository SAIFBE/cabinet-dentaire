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
    <div style={{ 
      height: '100%', 
      overflowY: 'auto', 
      padding: '24px', 
      backgroundColor: 'var(--color-bg-card)', 
      border: '1px solid var(--color-border)', 
      borderRadius: '12px',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
    }}>
      {Object.entries(groupedImages).map(([monthYear, groupImages]) => (
        <div key={monthYear} style={{ marginBottom: '40px' }}>
          <div style={{
            position: 'sticky',
            top: '-24px', // Account for wrapper padding
            zIndex: 10,
            padding: '16px 0',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)', // for Safari
            marginBottom: '20px',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600, 
              textTransform: 'capitalize', 
              color: 'var(--color-text)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></span>
              {monthYear}
              <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-tertiary)', backgroundColor: 'var(--color-bg)', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px' }}>
                {groupImages.length} {groupImages.length > 1 ? 'images' : 'image'}
              </span>
            </h3>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '24px' 
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
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#fff',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative'
      }}
      onMouseOver={(e) => {
         e.currentTarget.style.transform = 'translateY(-6px)';
         e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
         const imgElement = e.currentTarget.querySelector('img');
         if (imgElement) imgElement.style.transform = 'scale(1.05)';
      }}
      onMouseOut={(e) => {
         e.currentTarget.style.transform = 'translateY(0)';
         e.currentTarget.style.boxShadow = 'none';
         const imgElement = e.currentTarget.querySelector('img');
         if (imgElement) imgElement.style.transform = 'scale(1)';
      }}
    >
      <div style={{ height: '180px', width: '100%', backgroundColor: '#111827', position: 'relative', overflow: 'hidden' }}>
        <img 
          src={bgImage} 
          alt={image.title} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: 0.9 
          }}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300.png?text=Erreur+Image'; }}
        />
        {/* Type Badge - Glassmorphism */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          color: 'white',
          fontSize: '0.7rem',
          padding: '4px 10px',
          borderRadius: '20px',
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.5px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {image.type}
        </div>
      </div>
      
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '1.05rem', 
          fontWeight: 600,
          color: 'var(--color-text)',
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {image.title || 'Image Clinique Sans Titre'}
        </h4>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
          <div style={{ padding: '4px', backgroundColor: 'var(--color-bg)', borderRadius: '6px' }}>
             <Calendar size={14} color="var(--color-primary)" />
          </div>
          {formatDate(image.capturedAt || image.uploadedAt || image.createdAt)}
        </div>
        
        {image.linkedTeeth && image.linkedTeeth.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
            <div style={{ padding: '4px', backgroundColor: 'var(--color-bg)', borderRadius: '6px' }}>
               <Tag size={14} color="var(--color-primary)" />
            </div>
            Dents: <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{image.linkedTeeth.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
