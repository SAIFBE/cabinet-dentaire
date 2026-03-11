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
          padding: '10px 14px',
          marginBottom: '8px',
          border: isActive ? '1px solid rgba(var(--color-primary-rgb), 0.2)' : '1px solid transparent',
          borderRadius: '8px',
          backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
          color: isActive ? 'white' : 'var(--color-text)',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '0.95rem',
          fontWeight: isActive ? 500 : 400,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isActive ? '0 4px 12px rgba(var(--color-primary-rgb), 0.2)' : 'none',
        }}
        onMouseOver={(e) => {
           if (!isActive) {
               e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
               e.currentTarget.style.transform = 'translateX(4px)';
           }
        }}
        onMouseOut={(e) => {
           if (!isActive) {
               e.currentTarget.style.backgroundColor = 'transparent';
               e.currentTarget.style.transform = 'translateX(0)';
           }
        }}
      >
        <span style={{ transition: 'transform 0.2s' }}>{label}</span>
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: 600,
          backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--color-bg)', 
          color: isActive ? 'white' : 'var(--color-text-secondary)',
          padding: '3px 8px', 
          borderRadius: '12px',
          border: isActive ? 'none' : '1px solid var(--color-border)',
          transition: 'all 0.2s'
        }}>
          {counts[type] || 0}
        </span>
      </button>
    );
  };

  return (
    <div style={{ padding: '0 20px 20px 0', borderRight: '1px solid var(--color-border)', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ padding: '8px', backgroundColor: 'var(--color-primary-light)', borderRadius: '8px', color: 'var(--color-primary)' }}>
          <Filter size={18} />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Filtres Cliniques</h3>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '12px', marginLeft: '4px' }}>
          Cathégories
        </h4>
        <CategoryButton type="all" label="Toutes les images" />
        <CategoryButton type="panoramic" label="Panoramique" />
        <CategoryButton type="periapical" label="Rétro-alvéolaire" />
        <CategoryButton type="cephalometric" label="Céphalométrique" />
        <CategoryButton type="cbct" label="Cone Beam (CBCT)" />
        <CategoryButton type="intraoral" label="Photo Intra-orale" />
      </div>

      <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
        <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>Recherche par dent</h4>
        <input 
          type="text" 
          placeholder="Ex: 46, 47" 
          className="form-input" 
          value={filters.tooth}
          onChange={(e) => setFilters(prev => ({ ...prev, tooth: e.target.value }))}
          style={{ 
            width: '100%', 
            padding: '10px 14px', 
            fontSize: '0.95rem',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)';
            e.target.style.boxShadow = '0 0 0 3px rgba(var(--color-primary-rgb), 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-border)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '10px', lineHeight: 1.4, display: 'flex', gap: '6px' }}>
           <span style={{ color: 'var(--color-primary)' }}>*</span> Un Odontogramme visuel sera ajouté dans la Phase 2.
        </p>
      </div>
    </div>
  );
}
