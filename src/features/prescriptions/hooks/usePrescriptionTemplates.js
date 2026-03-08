import { generateId } from '../../../lib/utils'; // if needed for ids

export function usePrescriptionTemplates() {
  
  const templates = [
    {
      id: 'infection_standard',
      label: 'Infection Dentaire Standard',
      medications: [
        { id: generateId(), name: 'Amoxicilline', dosage: '500mg', form: 'Gélule', frequency: '3 fois/jour', duration: '7 jours', instructions: 'Prendre au milieu des repas' },
        { id: generateId(), name: 'Paracétamol', dosage: '1000mg', form: 'Comprimé', frequency: 'Si douleur', duration: '5 jours', instructions: 'Espacer les prises de 6h minimum (Max 3/j)' }
      ],
      generalInstructions: 'En cas d\'allergie ou d\'effets secondaires, veuillez contacter le cabinet.'
    },
    {
       id: 'infection_allergy',
       label: 'Infection (Allergie Pénicilline)',
       medications: [
         { id: generateId(), name: 'Clindamycine', dosage: '300mg', form: 'Gélule', frequency: '3 fois/jour', duration: '7 jours', instructions: 'Prendre avec un grand verre d\'eau' },
         { id: generateId(), name: 'Paracétamol', dosage: '1000mg', form: 'Comprimé', frequency: 'Si douleur', duration: '5 jours', instructions: 'Espacer les prises de 6h minimum' }
       ],
       generalInstructions: 'Patient allergique à la pénicilline.'
    },
    {
      id: 'post_extraction',
      label: 'Post-Extraction / Chirurgie',
      medications: [
        { id: generateId(), name: 'Ibuprofène', dosage: '400mg', form: 'Comprimé', frequency: '3 fois/jour', duration: '3 jours', instructions: 'À prendre au cours des repas' },
        { id: generateId(), name: 'Paracétamol', dosage: '1000mg', form: 'Comprimé', frequency: 'En alternance', duration: '3 jours', instructions: 'Alterner avec l\'Ibuprofène toutes les 4h si forte douleur' },
        { id: generateId(), name: 'Chlorhexidine', dosage: '0.12%', form: 'Bain de bouche', frequency: '2 fois/jour', duration: '10 jours', instructions: 'Commencer 24h APRÈS l\'intervention. Ne pas avaler.' }
      ],
      generalInstructions: 'Ne pas manger ni boire chaud. Pas de bain de bouche le premier jour. Alimentation tiède/froide et molle pendant 48h. Éviter de cracher ou de fumer.'
    },
    {
      id: 'douleur_aigue',
      label: 'Douleur Aiguë (Pulpite)',
      medications: [
        { id: generateId(), name: 'Ibuprofène', dosage: '400mg', form: 'Comprimé', frequency: '3 fois/jour', duration: '3 jours', instructions: 'Prise systématique pendant 3 jours' },
        { id: generateId(), name: 'Tramadol/Paracétamol', dosage: '37.5mg/325mg', form: 'Comprimé', frequency: 'Si forte douleur', duration: '3 jours', instructions: 'Ne pas dépasser 4 comprimés par jour' }
      ],
      generalInstructions: ''
    },
    {
       id: 'post_detartrage',
       label: 'Post-Détartrage (Gingivite)',
       medications: [
         { id: generateId(), name: 'Bain de bouche antiseptique', dosage: '-', form: 'Liquide', frequency: '2 fois/jour', duration: '7 jours', instructions: 'Garder en bouche 1 minute - pure ou dilué selon notice' },
         { id: generateId(), name: 'Gel gingival', dosage: '-', form: 'Gel', frequency: '3 fois/jour', duration: '7 jours', instructions: 'Appliquer sur les gencives douloureuses après le brossage' }
       ],
       generalInstructions: 'Brossage souple. Utilisation de brossettes interdentaires recommandée.'
    }
  ];

  const getTemplate = (templateId) => {
    return templates.find(t => t.id === templateId) || null;
  };

  return {
    templates,
    getTemplate
  };
}
