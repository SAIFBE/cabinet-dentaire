import { useState, useRef } from 'react';
import { useRadiology } from '../../context/RadiologyContext';
import { Button } from '../../../../shared/components/Button';
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Contrast, Maximize, X, Shrink } from 'lucide-react';

export function ImageWorkspace() {
  const { activeImage, setActiveImage } = useRadiology();
  const containerRef = useRef(null);

  // Viewer State (MVP Scope Transforms)
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [inverted, setInverted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!activeImage) return null;

  const bgImage = activeImage.imageUrl || activeImage.fileUrl || `https://via.placeholder.com/800x600.png?text=${activeImage.type}`;

  // Controls
  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 4));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  const handleRotateLeft = () => setRotation(r => r - 90);
  const handleRotateRight = () => setRotation(r => r + 90);
  const handleInvert = () => setInverted(!inverted);
  
  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setInverted(false);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.log(err));
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        backgroundColor: '#111827', // Dark mode BG for Clinical Space
        color: 'white',
        position: 'relative'
      }}
    >
      {/* Top Header - Patient info & Close Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10 }}>
        <div>
           <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>{activeImage.title || 'Image Sans Titre'}</h3>
           <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Date: {activeImage.capturedAt?.split('T')[0]}</span>
        </div>
        
        {/* Only show Close button if we are NOT in fullscreen. If in fullscreen, the browser ESC handles it nicely, or a dedicated exit fullscreen button. */}
        {!isFullscreen && (
          <button 
             onClick={() => setActiveImage(null)}
             style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <X size={20} /> Fermer
          </button>
        )}
      </div>

      {/* The Canvas Area */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'move' }}>
        <img 
          src={bgImage} 
          alt={activeImage.title}
          style={{
            maxHeight: '90%',
            maxWidth: '90%',
            objectFit: 'contain',
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            filter: inverted ? 'invert(1) hue-rotate(180deg)' : 'none',
            transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1), filter 0.2s',
          }}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600.png?text=Erreur+de+chargement'; }}
        />
      </div>

      {/* Bottom Floating Toolbar */}
      <div style={{ 
        position: 'absolute', 
        bottom: '24px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(31, 41, 55, 0.9)', 
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '8px 16px', 
        borderRadius: '32px',
        display: 'flex',
        gap: '4px',
        zIndex: 10,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
      }}>
        <ToolButton onClick={handleZoomOut} icon={<ZoomOut size={16} />} title="Zoom Arrière" />
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: '0.8rem', minWidth: '40px', justifyContent: 'center' }}>
          {Math.round(scale * 100)}%
        </div>
        <ToolButton onClick={handleZoomIn} icon={<ZoomIn size={16} />} title="Zoom Avant" />
        
        <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />
        
        <ToolButton onClick={handleRotateLeft} icon={<RotateCcw size={16} />} title="Rotation Gauche" />
        <ToolButton onClick={handleRotateRight} icon={<RotateCw size={16} />} title="Rotation Droite" />
        
        <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />
        
        <ToolButton onClick={handleInvert} icon={<Contrast size={16} />} title={inverted ? "Vision Normale" : "Inverser Couleurs"} active={inverted} />
        
        <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />
        
        <ToolButton onClick={handleReset} icon={<Shrink size={16} />} title="Réinitialiser Vue" />
        <ToolButton onClick={handleFullscreen} icon={<Maximize size={16} />} title={isFullscreen ? "Quitter Plein Écran" : "Plein Écran"} active={isFullscreen} />
      </div>
    </div>
  );
}

function ToolButton({ icon, onClick, title, active = false }) {
  return (
    <button 
      onClick={onClick}
      title={title}
      style={{
        background: active ? 'var(--color-primary)' : 'transparent',
        border: 'none',
        color: active ? 'white' : 'var(--color-text-secondary)',
        padding: '8px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}
      onMouseOver={(e) => {
         if (!active) {
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
         }
      }}
      onMouseOut={(e) => {
         if (!active) {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
            e.currentTarget.style.backgroundColor = 'transparent';
         }
      }}
    >
      {icon}
    </button>
  );
}
