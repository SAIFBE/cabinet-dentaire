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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '16px 24px', 
        backgroundColor: 'rgba(17, 24, 39, 0.8)', 
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        zIndex: 10 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ 
             width: '40px', height: '40px', 
             borderRadius: '8px', 
             backgroundColor: 'rgba(255,255,255,0.1)', 
             display: 'flex', justifyContent: 'center', alignItems: 'center',
             color: '#9CA3AF'
           }}>
             <Maximize size={20} />
           </div>
           <div>
             <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.5px' }}>{activeImage.title || 'Image Clinique'}</h3>
             <span style={{ fontSize: '0.85rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></span>
                {activeImage.capturedAt?.split('T')[0] || 'Date inconnue'}
             </span>
           </div>
        </div>
        
        {/* Only show Close button if we are NOT in fullscreen. If in fullscreen, the browser ESC handles it nicely, or a dedicated exit fullscreen button. */}
        {!isFullscreen && (
          <button 
             onClick={() => setActiveImage(null)}
             style={{ 
               background: 'rgba(255,255,255,0.1)', 
               border: '1px solid rgba(255,255,255,0.05)', 
               color: 'white', 
               cursor: 'pointer', 
               display: 'flex', 
               alignItems: 'center', 
               gap: '8px',
               padding: '8px 16px',
               borderRadius: '8px',
               fontSize: '0.9rem',
               fontWeight: 500,
               transition: 'all 0.2s'
             }}
             onMouseOver={(e) => {
               e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
               e.currentTarget.style.transform = 'translateY(-1px)';
             }}
             onMouseOut={(e) => {
               e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
               e.currentTarget.style.transform = 'translateY(0)';
             }}
          >
            <X size={18} /> Fermer l'espace
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
        bottom: '32px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(17, 24, 39, 0.85)', 
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '6px 12px', 
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        zIndex: 10,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
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
        color: active ? 'white' : 'rgba(255,255,255,0.7)',
        padding: '10px',
        margin: '0 2px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseOver={(e) => {
         if (!active) {
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.transform = 'scale(1.1)';
         }
      }}
      onMouseOut={(e) => {
         if (!active) {
            e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
         }
      }}
    >
      {icon}
    </button>
  );
}
