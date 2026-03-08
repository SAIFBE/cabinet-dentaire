import { useRadiology } from '../../context/RadiologyContext';
import { Filter } from 'lucide-react';

export function RadiologySidebar() {
  const { filters, setFilters, images } = useRadiology();

  // Derived counts for the side spine based on the currently loaded images
  const counts = {
    all: images.length,
    panoramic: images.filter(i => i.type === 'panoramic').length,
    periapical: images.filter(i => i.type === 'periapical').length,
    cephalometric: images.filter(i => i.type === 'cephalometric').length,
    cbct: images.filter(i => i.type === 'cbct').length,
    intraoral: images.filter(i => i.type === 'intraoral').length,
    other: images.filter(i => i.type === 'other').length,
  };

  const handleTypeToggle = (type) => {
    setFilters(prev => ({ ...prev, type }));
  };

  const CategoryButton = ({ type, label }) => {
    const isActive = filters.type === type;
    return (
      <button
        onClick={() => handleTypeToggle(type)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '8px 12px',
          marginBottom: '6px',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
          color: isActive ? 'white' : 'var(--color-text)',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '0.9rem',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
           if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
        }}
        onMouseOut={(e) => {
           if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <span>{label}</span>
        <span style={{ 
          fontSize: '0.75rem', 
          backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-border)', 
          padding: '2px 6px', 
          borderRadius: '10px' 
        }}>
          {counts[type] || 0}
        </span>
      </button>
    );
  };

  return (
    <div style={{ padding: '0 16px 16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Filter size={16} />
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Filtres</h3>
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>Catégorie</h4>
        <CategoryButton type="all" label="Toutes les images" />
        <CategoryButton type="panoramic" label="Panoramique" />
        <CategoryButton type="periapical" label="Rétro-alvéolaire" />
        <CategoryButton type="cephalometric" label="Céphalométrique" />
        <CategoryButton type="cbct" label="Cone Beam (CBCT)" />
        <CategoryButton type="intraoral" label="Photo Intra-orale" />
      </div>

      <div>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>Dent spécifique</h4>
        <input 
          type="text" 
          placeholder="Ex: 46" 
          className="form-input" 
          value={filters.tooth}
          onChange={(e) => setFilters(prev => ({ ...prev, tooth: e.target.value }))}
          style={{ width: '100%', padding: '8px', fontSize: '0.9rem' }}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
           * Un Odontogramme visuel sera ajouté dans la Phase 2.
        </p>
      </div>
    </div>
  );
}
