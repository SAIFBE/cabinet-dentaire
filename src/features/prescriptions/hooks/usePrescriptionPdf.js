import { useCallback } from 'react';

/**
 * usePrescriptionPdf handles the logic for triggering the native print dialog.
 * It expects the UI to be styled with `@media print` to hide everything except the active prescription view.
 */
export function usePrescriptionPdf() {
  
  const printPrescription = useCallback((prescription) => {
    if (!prescription) {
      console.error("Aucune ordonnance fournie pour l'impression.");
      return;
    }

    if (prescription.status === 'draft') {
      alert("Attention: L'ordonnance doit être finalisée avant l'impression officielle.");
      return;
    }

    // Rely on window.print() and CSS @media print
    window.print();
    
    // In a real app, we might want to update the status to 'printed' here via API
    // but window.print() is blocking/async depending on the browser, so we handle state updates
    // carefully generally in the calling component.

  }, []);

  return { printPrescription };
}
