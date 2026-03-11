import { MessageSquarePlus, ExternalLink } from 'lucide-react';

const FEEDBACK_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScc-ZPmNh9jPebu79lgmJKH4RHLFk9miveTfz4KCoBiyxtCGg/viewform?usp=dialog";

export function FeedbackWidget() {
  const handleFeedbackClick = () => {
    window.open(FEEDBACK_FORM_URL, "_blank");
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-primary-50)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      border: '1px solid rgba(123, 106, 230, 0.1)',
      marginTop: 'auto', // Pushes it to the bottom if in a flex container
      boxShadow: '0 2px 4px rgba(123, 106, 230, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '6px', 
          borderRadius: '8px',
          color: 'var(--color-primary)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <MessageSquarePlus size={18} strokeWidth={2.5} />
        </div>
        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary-dark, var(--color-text))' }}>
          Votre avis compte
        </span>
      </div>
      
      <p style={{ 
        fontSize: '0.8rem', 
        color: 'var(--color-text-secondary)',
        margin: 0,
        lineHeight: 1.5
      }}>
        Merci de tester Dentisafe. Votre avis est très important pour nous aider à améliorer l'application.
      </p>
      
      <button 
        onClick={handleFeedbackClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          width: '100%',
          padding: '8px 12px',
          backgroundColor: '#ffffff',
          color: 'var(--color-primary)',
          border: '1px solid rgba(123, 106, 230, 0.2)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-primary)';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.borderColor = 'var(--color-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.color = 'var(--color-primary)';
          e.currentTarget.style.borderColor = 'rgba(123, 106, 230, 0.2)';
        }}
      >
        Donner mon avis <ExternalLink size={14} />
      </button>
    </div>
  );
}
