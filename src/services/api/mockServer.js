/**
 * Mock Server — in-memory data stores for all modules.
 * Simulates API latency (300–800ms) and auth checks.
 */

import { generateId, randomDelay } from '../../lib/utils';
import { getStockStatus } from '../../utils/stockStatus';

// ============ AUTH STATE (in-memory only) ============
let currentSession = null;

const MOCK_USERS = [
  { id: '1', username: 'admin', password: '123456', name: 'Dr. Sarah Mitchell', role: 'admin' },
  { id: '2', username: 'secretary', password: 'password', name: 'Emily Johnson', role: 'secretary' },
  { id: '3', username: 'assistant', password: 'password', name: 'James Wilson', role: 'assistant' },
];

// ============ PATIENTS ============
let patients = [
  { id: 'p1', firstName: 'John', lastName: 'Doe', email: 'john.doe@email.com', phone: '(555) 123-4567', dateOfBirth: '1985-03-15', address: '123 Main St, Springfield', notes: 'Regular checkup patient', insurance: 'CNSS', createdAt: '2025-12-01' },
  { id: 'p2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@email.com', phone: '(555) 234-5678', dateOfBirth: '1992-07-22', address: '456 Oak Ave, Riverside', notes: 'Orthodontic treatment ongoing', insurance: 'CNOPS', createdAt: '2025-12-05' },
  { id: 'p3', firstName: 'Michael', lastName: 'Brown', email: 'michael.b@email.com', phone: '(555) 345-6789', dateOfBirth: '1978-11-30', address: '789 Pine Rd, Lakewood', notes: 'Crown replacement scheduled', insurance: 'CNSS', createdAt: '2025-12-10' },
  { id: 'p4', firstName: 'Sarah', lastName: 'Davis', email: 'sarah.d@email.com', phone: '(555) 456-7890', dateOfBirth: '2001-05-08', address: '321 Elm St, Georgetown', notes: 'Wisdom teeth extraction pending', insurance: 'CNOPS', createdAt: '2026-01-02' },
  { id: 'p5', firstName: 'Robert', lastName: 'Garcia', email: 'robert.g@email.com', phone: '(555) 567-8901', dateOfBirth: '1968-09-14', address: '654 Maple Dr, Fairview', notes: 'Implant consultation', insurance: 'CNSS', createdAt: '2026-01-15' },
];

// ============ APPOINTMENTS ============
let appointments = [
  { id: 'a1', patientId: 'p1', patientName: 'John Doe', date: '2026-02-28', time: '09:00', type: 'Checkup', status: 'scheduled', notes: 'Routine cleaning' },
  { id: 'a2', patientId: 'p2', patientName: 'Jane Smith', date: '2026-02-28', time: '10:30', type: 'Orthodontics', status: 'scheduled', notes: 'Braces adjustment' },
  { id: 'a3', patientId: 'p3', patientName: 'Michael Brown', date: '2026-02-28', time: '14:00', type: 'Crown', status: 'completed', notes: 'Crown fitting' },
  { id: 'a4', patientId: 'p4', patientName: 'Sarah Davis', date: '2026-03-01', time: '09:30', type: 'Extraction', status: 'scheduled', notes: 'Wisdom teeth consultation' },
  { id: 'a5', patientId: 'p5', patientName: 'Robert Garcia', date: '2026-03-01', time: '11:00', type: 'Implant', status: 'scheduled', notes: 'Implant assessment' },
];

// ============ WAITING ROOM ============
let waitingRoom = [
  { id: 'w1', patientId: 'p1', patientName: 'John Doe', checkedInAt: '2026-02-28T08:45:00', appointmentTime: '09:00', status: 'waiting' },
  { id: 'w2', patientId: 'p2', patientName: 'Jane Smith', checkedInAt: '2026-02-28T10:15:00', appointmentTime: '10:30', status: 'waiting' },
];

// ============ INVOICES ============
let invoiceCounter = 4;

let invoices = [
  {
    id: 'inv1', number: 'INV-2026-0001', patientId: 'p1', patientName: 'John Doe', appointmentId: 'a1',
    status: 'paid', issuedAt: '2026-02-15',
    items: [
      { id: 'it1', description: 'Dental Cleaning', qty: 1, unitPrice: 120, lineTotal: 120 },
      { id: 'it2', description: 'X-Ray', qty: 1, unitPrice: 80, lineTotal: 80 },
    ],
    subtotal: 200, taxRate: 0, taxAmount: 0, discount: 0, total: 200,
    payments: [
      { id: 'pay1', amount: 200, method: 'card', paidAt: '2026-02-15', reference: 'CB-8821', note: '' },
    ],
    paidAmount: 200, balance: 0, notes: '', createdAt: '2026-02-15', updatedAt: '2026-02-15',
  },
  {
    id: 'inv2', number: 'INV-2026-0002', patientId: 'p3', patientName: 'Michael Brown', appointmentId: 'a3',
    status: 'partial', issuedAt: '2026-02-20',
    items: [
      { id: 'it3', description: 'Crown Preparation', qty: 1, unitPrice: 450, lineTotal: 450 },
      { id: 'it4', description: 'Temporary Crown', qty: 1, unitPrice: 150, lineTotal: 150 },
    ],
    subtotal: 600, taxRate: 0, taxAmount: 0, discount: 0, total: 600,
    payments: [
      { id: 'pay2', amount: 300, method: 'cash', paidAt: '2026-02-20', reference: '', note: 'Acompte' },
    ],
    paidAmount: 300, balance: 300, notes: 'Couronne définitive à poser', createdAt: '2026-02-20', updatedAt: '2026-02-20',
  },
  {
    id: 'inv3', number: 'INV-2026-0003', patientId: 'p2', patientName: 'Jane Smith', appointmentId: 'a2',
    status: 'paid', issuedAt: '2026-02-22',
    items: [
      { id: 'it5', description: 'Orthodontic Adjustment', qty: 1, unitPrice: 250, lineTotal: 250 },
    ],
    subtotal: 250, taxRate: 0, taxAmount: 0, discount: 0, total: 250,
    payments: [
      { id: 'pay3', amount: 250, method: 'transfer', paidAt: '2026-02-22', reference: 'VIR-4412', note: '' },
    ],
    paidAmount: 250, balance: 0, notes: '', createdAt: '2026-02-22', updatedAt: '2026-02-22',
  },
  {
    id: 'inv4', number: 'INV-2026-0004', patientId: 'p4', patientName: 'Sarah Davis', appointmentId: null,
    status: 'issued', issuedAt: '2026-02-25',
    items: [
      { id: 'it6', description: 'Consultation', qty: 1, unitPrice: 75, lineTotal: 75 },
      { id: 'it7', description: 'Panoramic X-Ray', qty: 1, unitPrice: 120, lineTotal: 120 },
    ],
    subtotal: 195, taxRate: 0, taxAmount: 0, discount: 0, total: 195,
    payments: [],
    paidAmount: 0, balance: 195, notes: '', createdAt: '2026-02-25', updatedAt: '2026-02-25',
  },
];

// ============ STOCK ============
let stockItems = [
  { id: 's1', name: 'Latex Gloves (Box)', category: 'Consumables', quantity: 45, minQuantity: 20, unit: 'boxes', unitPrice: 12.50, supplier: 'MedSupply Co.', lastRestocked: '2026-02-10', expiryDate: '2027-06-15', createdAt: '2026-01-05', updatedAt: '2026-02-10' },
  { id: 's2', name: 'Composite Resin', category: 'Materials', quantity: 18, minQuantity: 10, unit: 'syringes', unitPrice: 45.00, supplier: 'DentalDirect', lastRestocked: '2026-02-15', expiryDate: '2027-12-01', createdAt: '2026-01-10', updatedAt: '2026-02-15' },
  { id: 's3', name: 'Anesthetic Cartridges', category: 'Medication', quantity: 8, minQuantity: 15, unit: 'boxes', unitPrice: 85.00, supplier: 'PharmaPlus', lastRestocked: '2026-01-28', expiryDate: '2026-09-30', createdAt: '2026-01-02', updatedAt: '2026-01-28' },
  { id: 's4', name: 'Surgical Masks (Box)', category: 'Consumables', quantity: 32, minQuantity: 10, unit: 'boxes', unitPrice: 8.00, supplier: 'MedSupply Co.', lastRestocked: '2026-02-18', expiryDate: '2028-01-01', createdAt: '2026-01-08', updatedAt: '2026-02-18' },
  { id: 's5', name: 'Impression Material', category: 'Materials', quantity: 12, minQuantity: 5, unit: 'packs', unitPrice: 55.00, supplier: 'DentalDirect', lastRestocked: '2026-02-12', expiryDate: '2027-03-15', createdAt: '2026-01-15', updatedAt: '2026-02-12' },
  { id: 's6', name: 'Sterilization Pouches', category: 'Consumables', quantity: 60, minQuantity: 25, unit: 'packs', unitPrice: 15.00, supplier: 'MedSupply Co.', lastRestocked: '2026-02-20', expiryDate: '2028-06-01', createdAt: '2026-01-20', updatedAt: '2026-02-20' },
  { id: 's7', name: 'Dental Floss (Box)', category: 'Consumables', quantity: 0, minQuantity: 10, unit: 'boxes', unitPrice: 5.00, supplier: 'MedSupply Co.', lastRestocked: '2025-12-01', expiryDate: '2027-01-01', createdAt: '2025-11-01', updatedAt: '2025-12-01' },
  { id: 's8', name: 'Hydrogen Peroxide 3%', category: 'Medication', quantity: 4, minQuantity: 5, unit: 'bottles', unitPrice: 10.00, supplier: 'PharmaPlus', lastRestocked: '2025-06-10', expiryDate: '2025-12-31', createdAt: '2025-05-01', updatedAt: '2025-06-10' },
];

// ============ STOCK MOVEMENTS ============
let stockMovements = [];

// ============ DENTAL CHARTS ============
// FDI tooth numbers per age category
const FDI_ADULT = [
  11,12,13,14,15,16,17,18, 21,22,23,24,25,26,27,28,
  31,32,33,34,35,36,37,38, 41,42,43,44,45,46,47,48,
];
const FDI_CHILD = [
  51,52,53,54,55, 61,62,63,64,65,
  71,72,73,74,75, 81,82,83,84,85,
];

function buildTeeth(fdiList) {
  return fdiList.map((n) => ({
    toothNumber: n,
    status: 'healthy',
    notes: '',
    updatedAt: null,
    updatedBy: null,
  }));
}

let dentalCharts = {}; // keyed by patientId

// ============ RADIOLOGY IMAGES ============
let radiologyImages = [
  { id: 'rx1', patientId: 'p1', patientName: 'John Doe', fileName: 'panoramic_xray.jpg', fileType: 'image/jpeg', fileSize: 2400000, category: 'Panoramic', tooth: null, diagnosis: 'No abnormalities detected', tags: ['routine', 'panoramic'], uploadedBy: 'admin', uploadedAt: '2026-01-15T09:30:00' },
  { id: 'rx2', patientId: 'p1', patientName: 'John Doe', fileName: 'periapical_tooth14.png', fileType: 'image/png', fileSize: 850000, category: 'Periapical', tooth: '14', diagnosis: 'Mild caries on distal surface', tags: ['periapical', 'caries'], uploadedBy: 'admin', uploadedAt: '2026-02-10T11:00:00' },
  { id: 'rx3', patientId: 'p3', patientName: 'Michael Brown', fileName: 'cbct_scan.pdf', fileType: 'application/pdf', fileSize: 5200000, category: 'CBCT', tooth: null, diagnosis: 'Pre-implant bone assessment', tags: ['cbct', 'implant'], uploadedBy: 'admin', uploadedAt: '2026-02-18T14:15:00' },
  { id: 'rx4', patientId: 'p2', patientName: 'Jane Smith', fileName: 'cephalometric.jpg', fileType: 'image/jpeg', fileSize: 1800000, category: 'Cephalometric', tooth: null, diagnosis: 'Orthodontic planning', tags: ['orthodontics', 'cephalometric'], uploadedBy: 'assistant', uploadedAt: '2026-02-20T10:00:00' },
];

// ============ PRESCRIPTIONS ============
let prescriptions = [
  { id: 'presc1', patientId: 'p1', patientName: 'John Doe', date: '2026-02-15', doctorName: 'Dr. Sarah Mitchell', medications: [{ id: 'm1', name: 'Amoxicilline', dosage: '500mg', form: 'Comprimé', frequency: '3 fois/jour', duration: '7 jours', instructions: 'Prendre au milieu du repas' }, { id: 'm2', name: 'Paracétamol', dosage: '1000mg', form: 'Comprimé', frequency: 'Si douleur', duration: '5 jours', instructions: 'Maximum 3 par jour' }], generalInstructions: 'Repos conseillé.', notes: 'Post-extraction', status: 'finalized', createdBy: 'admin', createdAt: '2026-02-15T10:00:00' },
  { id: 'presc2', patientId: 'p3', patientName: 'Michael Brown', date: '2026-02-20', doctorName: 'Dr. Sarah Mitchell', medications: [{ id: 'm3', name: 'Bain de bouche à la Chlorhexidine', dosage: '0.12%', form: 'Liquide', frequency: '2 fois/jour', duration: '14 jours', instructions: 'Ne pas rincer à l\'eau après' }], generalInstructions: '', notes: 'Préparation couronne', status: 'finalized', createdBy: 'admin', createdAt: '2026-02-20T14:30:00' },
  { id: 'presc3', patientId: 'p4', patientName: 'Sarah Davis', date: '2026-01-10', doctorName: 'Dr. Sarah Mitchell', medications: [{ id: 'm4', name: 'Ibuprofène', dosage: '400mg', form: 'Comprimé', frequency: '3 fois/jour', duration: '3 jours', instructions: 'Prendre avec de l\'eau' }], generalInstructions: 'Glace sur la joue si gonflement.', notes: 'Douleur aiguë', status: 'printed', createdBy: 'admin', createdAt: '2026-01-10T09:00:00' },
];

// ============ MEDICAL DOCUMENTS ============
let medicalDocuments = [
  { id: 'doc1', patientId: 'p1', patientName: 'John Doe', title: 'Initial Consultation Report', category: 'Notes', fileName: 'consultation_report.pdf', fileType: 'application/pdf', fileSize: 450000, description: 'Full oral examination findings', uploadedBy: 'admin', uploadedAt: '2025-12-01T09:00:00' },
  { id: 'doc2', patientId: 'p1', patientName: 'John Doe', title: 'Treatment Plan', category: 'Treatments', fileName: 'treatment_plan.pdf', fileType: 'application/pdf', fileSize: 320000, description: 'Comprehensive treatment schedule for 2026', uploadedBy: 'admin', uploadedAt: '2025-12-15T11:00:00' },
  { id: 'doc3', patientId: 'p2', patientName: 'Jane Smith', title: 'Orthodontic Progress', category: 'Treatments', fileName: 'ortho_progress.pdf', fileType: 'application/pdf', fileSize: 780000, description: 'Quarterly orthodontic progress report', uploadedBy: 'admin', uploadedAt: '2026-02-01T14:00:00' },
  { id: 'doc4', patientId: 'p3', patientName: 'Michael Brown', title: 'Crown Procedure Notes', category: 'Notes', fileName: 'crown_notes.pdf', fileType: 'application/pdf', fileSize: 210000, description: 'Detailed crown preparation notes', uploadedBy: 'assistant', uploadedAt: '2026-02-20T15:00:00' },
  { id: 'doc5', patientId: 'p5', patientName: 'Robert Garcia', title: 'Implant Assessment Report', category: 'Radiology', fileName: 'implant_assessment.pdf', fileType: 'application/pdf', fileSize: 1200000, description: 'CBCT analysis for implant placement', uploadedBy: 'admin', uploadedAt: '2026-01-15T10:00:00' },
];

// ============ MEDICAL RECORDS (Dossier Médical) ============
let medicalProfiles = [
  {
    patientId: 'p1', // John Doe
    allergies: ['Pénicilline'],
    chronicConditions: ['Hypertension artérielle'],
    backgroundMedications: ['Amlodipine 5mg'],
    surgicalHistory: 'Appendicectomie (2010)',
    dentalHistory: 'Brossage irrégulier',
    riskFactors: ['Fumeur (10/j)'],
    alerts: [
      { id: 'al_1', type: 'ALLERGY', severity: 'critical', description: 'Allergie à la Pénicilline', status: 'active', createdAt: '2025-12-01T10:00:00' },
      { id: 'al_2', type: 'CONDITION', severity: 'warning', description: 'Hypertension (sous traitement)', status: 'active', createdAt: '2025-12-01T10:00:00' }
    ]
  },
  {
    patientId: 'p3', // Michael Brown
    allergies: [],
    chronicConditions: [],
    backgroundMedications: ['Kardegic 75mg'],
    surgicalHistory: '',
    dentalHistory: 'Bruxisme',
    riskFactors: [],
    alerts: [
      { id: 'al_3', type: 'MEDICATION', severity: 'warning', description: 'Sous Anticoagulants (Risque hémorragique)', status: 'active', createdAt: '2025-12-10T09:00:00' }
    ]
  }
];

let consultationNotes = [
  {
    id: 'cn_1',
    patientId: 'p1',
    practitionerId: '1',
    date: '2026-02-28',
    chiefComplaint: 'Douleur vive sur une prémolaire bas gauche',
    symptoms: 'Douleur pulsatile, augmentée au froid',
    observations: 'Caries occluso-distale sur la 35. Test de vitalité positif.',
    clinicalAssessment: 'Pulpite irréversible 35',
    performedTreatments: 'Anesthésie loco-régionale. Ouverture de la chambre pulpaire. Pulpectomie.',
    followUpRecommendation: 'Prévoir obturation définitive la semaine prochaine',
    linkedRadiologyIds: [],
    linkedPrescriptionIds: ['presc1'],
    linkedTeeth: ['35'],
    status: 'finalized',
    createdAt: '2026-02-28T09:30:00',
    updatedAt: '2026-02-28T10:00:00'
  }
];

let treatmentPlans = [
  {
    id: 'tp_1',
    patientId: 'p1',
    toothNumber: '35',
    treatmentCode: 'OBTURATION_COMPO',
    description: 'Obturation composite 3 faces',
    status: 'planned',
    priority: 'high',
    createdAt: '2026-02-28T10:05:00',
    notes: 'Devis signé'
  },
  {
    id: 'tp_2',
    patientId: 'p3',
    toothNumber: '14',
    treatmentCode: 'COURONNE_CERAMO',
    description: 'Couronne céramo-métallique',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2026-02-15T11:00:00',
    notes: 'Empreinte réalisée'
  }
];

// ============ AUTH CHECK HELPER ============
function requireAuth() {
  if (!currentSession) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }
}

// ============ MOCK SERVER API ============
export const mockServer = {
  // --- Auth ---
  login(username, password) {
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      // SECURITY: Generic error — no user enumeration
      return { success: false, error: 'Invalid credentials' };
    }
    currentSession = { userId: user.id, role: user.role };
    return {
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
    };
  },

  logout() {
    currentSession = null;
  },

  isAuthenticated() {
    return !!currentSession;
  },

  // --- Patients ---
  getPatients() {
    requireAuth();
    return [...patients];
  },

  getPatientById(id) {
    requireAuth();
    
    // Safe ID extraction: handle if `id` is an object from somewhere upstream
    const rawId = typeof id === 'object' && id !== null ? (id.id || id) : id;
    
    // Normalize string ID parsing ('p1' vs '1' mismatch)
    const searchId = String(rawId).toLowerCase().replace('p', '');
    console.log('[patientsApi.getById] incoming id:', rawId, 'searchId:', searchId);
    
    // Find patient by comparing normalized string values
    const patient = patients.find((p) => {
      if (!p || !p.id) return false;
      const pIdNormalized = String(p.id).toLowerCase().replace('p', '');
      return pIdNormalized === searchId;
    });

    if (!patient) {
      const error = new Error('Patient not found');
      error.status = 404;
      throw error;
    }
    return { ...patient };
  },

  addPatient(data) {
    requireAuth();
    const patient = { ...data, id: generateId(), createdAt: new Date().toISOString().split('T')[0] };
    patients = [patient, ...patients];
    return patient;
  },

  updatePatient(id, data) {
    requireAuth();
    patients = patients.map((p) => (p.id === id ? { ...p, ...data } : p));
    return patients.find((p) => p.id === id);
  },

  deletePatient(id) {
    console.log("mockServer.deletePatient called with id:", id);
    requireAuth();
    const initialLength = patients.length;
    patients = patients.filter((p) => String(p.id) !== String(id));
    console.log(`mockServer.deletePatient: length went from ${initialLength} to ${patients.length}`);
    return { ok: true };
  },

  // --- Appointments ---
  getAppointments() {
    requireAuth();
    return [...appointments];
  },

  getAppointmentsByPatient(patientId) {
    requireAuth();
    return appointments.filter((a) => a.patientId === patientId);
  },

  addAppointment(data) {
    requireAuth();
    const appointment = { ...data, id: generateId(), status: 'scheduled' };
    appointments = [appointment, ...appointments];
    return appointment;
  },

  updateAppointment(id, data) {
    requireAuth();
    appointments = appointments.map((a) => (a.id === id ? { ...a, ...data } : a));
    return appointments.find((a) => a.id === id);
  },

  // --- Waiting Room ---
  getWaitingRoom() {
    requireAuth();
    return [...waitingRoom];
  },

  getWaitingRoomByPatient(patientId) {
    requireAuth();
    return waitingRoom.filter((w) => w.patientId === patientId);
  },

  checkIn(patientId, patientName, appointmentTime, appointmentId = null) {
    requireAuth();
    const entry = {
      id: generateId(),
      patientId,
      patientName,
      appointmentId,
      checkedInAt: new Date().toISOString(),
      appointmentTime,
      status: 'waiting',
    };
    waitingRoom = [...waitingRoom, entry];
    return entry;
  },

  updateWaitingRoomStatus(id, status) {
    requireAuth();
    waitingRoom = waitingRoom.map((w) => (w.id === id ? { ...w, status } : w));
    return waitingRoom.find((w) => w.id === id);
  },

  checkOut(id) {
    requireAuth();
    waitingRoom = waitingRoom.filter((w) => w.id !== id);
  },

  // --- Invoices ---
  getInvoices() {
    requireAuth();
    return [...invoices];
  },

  getInvoiceById(id) {
    requireAuth();
    const invoice = invoices.find((i) => i.id === id);
    if (!invoice) {
      const error = new Error('Invoice not found');
      error.status = 404;
      throw error;
    }
    return { ...invoice };
  },

  getInvoicesByPatient(patientId) {
    requireAuth();
    return invoices.filter((i) => i.patientId === patientId);
  },

  addInvoice(data) {
    requireAuth();
    invoiceCounter++;
    const now = new Date().toISOString().split('T')[0];
    const year = new Date().getFullYear();
    const number = `INV-${year}-${String(invoiceCounter).padStart(4, '0')}`;
    const items = (data.items || []).map((item, idx) => ({
      id: generateId(),
      description: item.description,
      qty: Number(item.qty) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      lineTotal: (Number(item.qty) || 1) * (Number(item.unitPrice) || 0),
    }));
    const subtotal = items.reduce((sum, it) => sum + it.lineTotal, 0);
    const taxRate = Number(data.taxRate) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const discount = Number(data.discount) || 0;
    const total = subtotal + taxAmount - discount;
    const invoice = {
      id: generateId(),
      number,
      patientId: data.patientId,
      patientName: data.patientName,
      appointmentId: data.appointmentId || null,
      status: 'issued',
      issuedAt: now,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discount,
      total,
      payments: [],
      paidAmount: 0,
      balance: total,
      notes: data.notes || '',
      createdAt: now,
      updatedAt: now,
    };
    invoices = [invoice, ...invoices];
    return invoice;
  },

  updateInvoice(id, data) {
    requireAuth();
    const now = new Date().toISOString().split('T')[0];
    invoices = invoices.map((inv) =>
      inv.id === id ? { ...inv, ...data, updatedAt: now } : inv
    );
    return invoices.find((inv) => inv.id === id);
  },

  addPaymentToInvoice(id, paymentData) {
    requireAuth();
    const invoice = invoices.find((i) => i.id === id);
    if (!invoice) {
      const error = new Error('Invoice not found');
      error.status = 404;
      throw error;
    }
    if (invoice.status === 'cancelled') {
      const error = new Error('Cannot add payment to cancelled invoice');
      error.status = 400;
      throw error;
    }
    const payment = {
      id: generateId(),
      amount: Number(paymentData.amount),
      method: paymentData.method,
      paidAt: paymentData.paidAt || new Date().toISOString().split('T')[0],
      reference: paymentData.reference || '',
      note: paymentData.note || '',
    };
    const updatedPayments = [...invoice.payments, payment];
    const paidAmount = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
    const balance = invoice.total - paidAmount;
    let status = invoice.status;
    if (paidAmount === 0) status = 'issued';
    else if (paidAmount > 0 && paidAmount < invoice.total) status = 'partial';
    else if (paidAmount >= invoice.total) status = 'paid';
    const now = new Date().toISOString().split('T')[0];
    invoices = invoices.map((inv) =>
      inv.id === id
        ? { ...inv, payments: updatedPayments, paidAmount, balance, status, updatedAt: now }
        : inv
    );
    return invoices.find((inv) => inv.id === id);
  },


  // --- Stock ---
  getStockItems() {
    requireAuth();
    return stockItems.map((item) => ({
      ...item,
      computedStatus: getStockStatus(item),
    }));
  },

  addStockItem(data) {
    requireAuth();
    const now = new Date().toISOString().split('T')[0];
    const item = { ...data, id: generateId(), lastRestocked: now, createdAt: now, updatedAt: now };
    stockItems = [item, ...stockItems];
    return { ...item, computedStatus: getStockStatus(item) };
  },

  updateStockItem(id, data) {
    requireAuth();
    stockItems = stockItems.map((s) => (s.id === id ? { ...s, ...data } : s));
    return stockItems.find((s) => s.id === id);
  },

  getStockMovements(productId) {
    requireAuth();
    const list = productId
      ? stockMovements.filter((m) => m.productId === productId)
      : [...stockMovements];
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  consumeStockItem(productId, { quantity, reason, patientId, appointmentId }) {
    requireAuth();
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      const error = new Error('Quantity must be greater than 0');
      error.code = 'INVALID_QUANTITY';
      throw error;
    }
    const product = stockItems.find((s) => s.id === productId);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    if (product.quantity < qty) {
      const error = new Error('Insufficient stock');
      error.code = 'INSUFFICIENT_STOCK';
      throw error;
    }
    const now = new Date().toISOString();
    product.quantity -= qty;
    product.updatedAt = now.split('T')[0];
    const movement = {
      id: generateId(),
      productId,
      productName: product.name,
      type: 'out',
      quantity: qty,
      reason: reason || '',
      patientId: patientId || null,
      appointmentId: appointmentId || null,
      createdAt: now,
    };
    stockMovements = [movement, ...stockMovements];
    return { movement, product: { ...product, computedStatus: getStockStatus(product) } };
  },

  restockStockItem(productId, { quantity, reason }) {
    requireAuth();
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      const error = new Error('Quantity must be greater than 0');
      error.code = 'INVALID_QUANTITY';
      throw error;
    }
    const product = stockItems.find((s) => s.id === productId);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    const now = new Date().toISOString();
    product.quantity += qty;
    product.lastRestocked = now.split('T')[0];
    product.updatedAt = now.split('T')[0];
    const movement = {
      id: generateId(),
      productId,
      productName: product.name,
      type: 'in',
      quantity: qty,
      reason: reason || '',
      patientId: null,
      appointmentId: null,
      createdAt: now,
    };
    stockMovements = [movement, ...stockMovements];
    return { movement, product: { ...product, computedStatus: getStockStatus(product) } };
  },

  // --- Dashboard Stats ---
  getDashboardStats() {
    requireAuth();
    return {
      totalPatients: patients.length,
      todayAppointments: appointments.filter((a) => a.date === '2026-02-28').length,
      pendingInvoices: invoices.filter((i) => i.status === 'pending').length,
      lowStockItems: stockItems.filter((s) => s.quantity <= s.minQuantity).length,
      recentAppointments: appointments.slice(0, 5),
    };
  },

  // --- Dental Charts ---
  getDentalChart(patientId) {
    requireAuth();
    return dentalCharts[patientId] || null;
  },

  createDentalChart(patientId, ageCategory) {
    requireAuth();
    if (dentalCharts[patientId]) return dentalCharts[patientId];
    const fdiList = ageCategory === 'child' ? FDI_CHILD : FDI_ADULT;
    const chart = {
      patientId,
      ageCategory,
      teeth: buildTeeth(fdiList),
      createdAt: new Date().toISOString(),
    };
    dentalCharts[patientId] = chart;
    return chart;
  },

  updateDentalTooth(patientId, toothNumber, patch) {
    requireAuth();
    const chart = dentalCharts[patientId];
    if (!chart) {
      const error = new Error('Chart not found');
      error.status = 404;
      throw error;
    }
    chart.teeth = chart.teeth.map((t) =>
      t.toothNumber === toothNumber
        ? { ...t, ...patch, toothNumber, updatedAt: new Date().toISOString(), updatedBy: currentSession?.role || 'unknown' }
        : t
    );
    dentalCharts[patientId] = { ...chart };
    return chart.teeth.find((t) => t.toothNumber === toothNumber);
  },

  // --- Radiology ---
  getRadiologyImages(patientId) {
    requireAuth();
    if (patientId) return radiologyImages.filter((r) => r.patientId === patientId);
    return [...radiologyImages];
  },

  addRadiologyImage(data) {
    requireAuth();
    const image = { ...data, id: generateId(), uploadedBy: currentSession?.role || 'unknown', uploadedAt: new Date().toISOString() };
    radiologyImages = [image, ...radiologyImages];
    return image;
  },

  deleteRadiologyImage(id) {
    requireAuth();
    radiologyImages = radiologyImages.filter((r) => r.id !== id);
  },

  // --- Prescriptions MVP API ---
  getPrescriptionsByPatient(patientId) {
    requireAuth();
    if (!patientId) return [];
    // Return sorted by date descending
    return prescriptions
      .filter((p) => p.patientId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getPrescriptionById(id) {
    requireAuth();
    const presc = prescriptions.find((p) => p.id === id);
    if (!presc) {
      const error = new Error('Prescription not found');
      error.status = 404;
      throw error;
    }
    return { ...presc };
  },

  createPrescription(patientId, data) {
    requireAuth();
    const patient = patients.find(p => p.id === patientId);
    if (!patient) throw new Error("Patient not found");

    const now = new Date().toISOString();
    const newPrescription = {
      id: generateId(),
      patientId,
      patientName: `${patient.firstName} ${patient.lastName}`,
      practitionerId: currentSession?.userId,
      doctorName: MOCK_USERS.find(u => u.id === currentSession?.userId)?.name || 'Dr. Inconnu',
      date: data.date || now.split('T')[0],
      status: 'draft',
      templateType: data.templateType || null,
      generalInstructions: data.generalInstructions || '',
      notes: data.notes || '',
      medications: data.medications || [],
      createdBy: currentSession?.role || 'unknown',
      createdAt: now,
      updatedAt: now,
    };
    
    prescriptions = [newPrescription, ...prescriptions];
    return { ...newPrescription };
  },

  updatePrescription(id, data) {
    requireAuth();
    const prescIndex = prescriptions.findIndex((p) => p.id === id);
    if (prescIndex === -1) throw new Error('Prescription not found');
    
    if (prescriptions[prescIndex].status === 'finalized' || prescriptions[prescIndex].status === 'printed') {
      throw new Error('Cannot edit a finalized prescription');
    }

    prescriptions[prescIndex] = {
      ...prescriptions[prescIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    return { ...prescriptions[prescIndex] };
  },
  
  finalizePrescription(id) {
    requireAuth();
    // Only admins (dentists) can finalize
    if (currentSession?.role !== 'admin') {
      const error = new Error('Only dentists can finalize prescriptions');
      error.status = 403;
      throw error;
    }

    const prescIndex = prescriptions.findIndex((p) => p.id === id);
    if (prescIndex === -1) throw new Error('Prescription not found');

    prescriptions[prescIndex] = {
      ...prescriptions[prescIndex],
      status: 'finalized',
      updatedAt: new Date().toISOString(),
    };
    
    return { ...prescriptions[prescIndex] };
  },

  deletePrescription(id) {
    requireAuth();
    const presc = prescriptions.find((p) => p.id === id);
    if (!presc) return;

    if (presc.status !== 'draft' && currentSession?.role !== 'admin') {
       throw new Error('Only admins can delete finalized prescriptions');
    }

    prescriptions = prescriptions.filter((p) => p.id !== id);
  },
  
  duplicatePrescription(id) {
    requireAuth();
    const source = prescriptions.find((p) => p.id === id);
    if (!source) throw new Error('Prescription not found');
    
    const now = new Date().toISOString();
    const clone = {
      ...source,
      id: generateId(),
      date: now.split('T')[0],
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      practitionerId: currentSession?.userId,
      doctorName: MOCK_USERS.find(u => u.id === currentSession?.userId)?.name || source.doctorName,
      createdBy: currentSession?.role || 'unknown',
      // Ensure medications have fresh IDs if we were using them
      medications: source.medications.map(m => ({...m, id: generateId()}))
    };
    
    prescriptions = [clone, ...prescriptions];
    return { ...clone };
  },

  // --- Medical Documents (Legacy/Generic) ---
  getMedicalDocuments(patientId) {
    requireAuth();
    if (patientId) return medicalDocuments.filter((d) => d.patientId === patientId);
    return [...medicalDocuments];
  },

  addMedicalDocument(data) {
    requireAuth();
    const doc = { ...data, id: generateId(), uploadedBy: currentSession?.role || 'unknown', uploadedAt: new Date().toISOString() };
    medicalDocuments = [doc, ...medicalDocuments];
    return doc;
  },

  deleteMedicalDocument(id) {
    requireAuth();
    medicalDocuments = medicalDocuments.filter((d) => d.id !== id);
  },

  // --- MEDICAL RECORDS MVP (Dossier Médical) ---
  getMedicalProfile(patientId) {
    requireAuth();
    if (!patientId) return null;
    let profile = medicalProfiles.find(p => p.patientId === patientId);
    if (!profile) {
      // Lazy initialization
      profile = {
        patientId,
        allergies: [],
        chronicConditions: [],
        backgroundMedications: [],
        surgicalHistory: '',
        dentalHistory: '',
        riskFactors: [],
        alerts: []
      };
      medicalProfiles.push(profile);
    }
    return { ...profile };
  },

  updateMedicalProfile(patientId, payload) {
    requireAuth();
    const index = medicalProfiles.findIndex(p => p.patientId === patientId);
    if (index > -1) {
      medicalProfiles[index] = { ...medicalProfiles[index], ...payload };
      return { ...medicalProfiles[index] };
    }
    // Create if not exists
    const newProfile = { patientId, alerts: [], ...payload };
    medicalProfiles.push(newProfile);
    return { ...newProfile };
  },

  createMedicalAlert(patientId, payload) {
    requireAuth();
    const index = medicalProfiles.findIndex(p => p.patientId === patientId);
    const alert = { ...payload, id: generateId(), createdAt: new Date().toISOString(), status: 'active' };
    
    if (index > -1) {
      medicalProfiles[index].alerts = [alert, ...(medicalProfiles[index].alerts || [])];
    } else {
      medicalProfiles.push({ patientId, alerts: [alert] });
    }
    return alert;
  },

  resolveMedicalAlert(patientId, alertId) {
    requireAuth();
    if (currentSession?.role === 'secretary' || currentSession?.role === 'assistant') {
      throw new Error('Only admins (dentists) can resolve medical alerts');
    }
    const index = medicalProfiles.findIndex(p => p.patientId === patientId);
    if (index > -1) {
      medicalProfiles[index].alerts = medicalProfiles[index].alerts.map(a => 
        a.id === alertId ? { ...a, status: 'resolved' } : a
      );
    }
    return { ok: true };
  },

  getTimelineEvents(patientId) {
    requireAuth();
    
    // Combine consultations, radiology, and prescriptions
    const patientConsultations = consultationNotes.filter(n => n.patientId === patientId).map(n => ({
      ...n,
      eventType: 'CONSULTATION',
      // Ensure 'date' is used for sorting
      sortDate: n.createdAt
    }));

    const patientRadiology = radiologyImages.filter(r => r.patientId === patientId).map(r => ({
      id: r.id,
      patientId: r.patientId,
      eventType: 'RADIOLOGY',
      date: r.uploadedAt.split('T')[0],
      sortDate: r.uploadedAt,
      practitionerId: r.uploadedBy,
      data: {
        category: r.category,
        tooth: r.tooth,
        fileName: r.fileName,
        diagnosis: r.diagnosis
      }
    }));

    const patientPrescriptions = prescriptions.filter(p => p.patientId === patientId && p.status !== 'draft').map(p => ({
      id: p.id,
      patientId: p.patientId,
      eventType: 'PRESCRIPTION',
      date: p.date,
      sortDate: p.createdAt,
      practitionerId: p.createdBy,
      data: {
        medicationCount: p.medications.length,
        notes: p.notes,
        status: p.status
      }
    }));

    // Future enhancement: Add treatment plan changes here

    // Sort descending by date
    const combined = [...patientConsultations, ...patientRadiology, ...patientPrescriptions];
    return combined.sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());
  },

  getConsultationNotes(patientId) {
    requireAuth();
    return consultationNotes.filter(n => n.patientId === patientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getConsultationNoteById(noteId) {
    requireAuth();
    const note = consultationNotes.find(n => n.id === noteId);
    if (!note) throw new Error('Consultation note not found');
    return { ...note };
  },

  createConsultationNote(payload) {
    requireAuth();
    if (currentSession?.role === 'secretary') throw new Error('Secretaries cannot create clinical notes');
    
    const now = new Date().toISOString();
    const note = {
      ...payload,
      id: generateId(),
      practitionerId: currentSession?.userId || 'unknown',
      status: 'draft',
      createdAt: now,
      updatedAt: now
    };
    consultationNotes = [note, ...consultationNotes];
    return { ...note };
  },

  updateConsultationNote(noteId, payload) {
    requireAuth();
    const index = consultationNotes.findIndex(n => n.id === noteId);
    if (index === -1) throw new Error('Note not found');
    
    if (consultationNotes[index].status === 'finalized' || consultationNotes[index].status === 'archived') {
       throw new Error('Cannot edit a finalized or archived note');
    }

    consultationNotes[index] = {
      ...consultationNotes[index],
      ...payload,
      updatedAt: new Date().toISOString()
    };
    return { ...consultationNotes[index] };
  },

  finalizeConsultationNote(noteId) {
     requireAuth();
     if (currentSession?.role !== 'admin') throw new Error('Only dentists can finalize notes');
     const index = consultationNotes.findIndex(n => n.id === noteId);
     if (index === -1) throw new Error('Note not found');
     
     consultationNotes[index].status = 'finalized';
     consultationNotes[index].updatedAt = new Date().toISOString();
     return { ...consultationNotes[index] };
  },

  deleteConsultationNote(noteId) {
    requireAuth();
    if (currentSession?.role !== 'admin') throw new Error('Only admins can delete notes');
    const index = consultationNotes.findIndex(n => n.id === noteId);
    if (index === -1) throw new Error('Note not found');
    
    // Instead of hard delete, we archive it
    consultationNotes[index].status = 'archived';
    consultationNotes[index].updatedAt = new Date().toISOString();
    return { ok: true };
  },

  getTreatmentPlan(patientId) {
    requireAuth();
    return treatmentPlans.filter(t => t.patientId === patientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  createTreatmentPlanItem(payload) {
    requireAuth();
    if (currentSession?.role === 'secretary') throw new Error('Secretaries cannot edit treatment plans');
    const item = {
      ...payload,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    treatmentPlans = [item, ...treatmentPlans];
    return { ...item };
  },

  updateTreatmentPlanItem(itemId, payload) {
    requireAuth();
    if (currentSession?.role === 'secretary') throw new Error('Secretaries cannot edit treatment plans');
    const index = treatmentPlans.findIndex(t => t.id === itemId);
    if (index === -1) throw new Error('Treatment item not found');
    
    treatmentPlans[index] = { ...treatmentPlans[index], ...payload };
    return { ...treatmentPlans[index] };
  },

  deleteTreatmentPlanItem(itemId) {
    requireAuth();
    const index = treatmentPlans.findIndex(t => t.id === itemId);
    if (index === -1) return;
    
    if (treatmentPlans[index].status !== 'planned' && currentSession?.role !== 'admin') {
      throw new Error('Only admins can delete in-progress or completed treatments');
    }
    treatmentPlans = treatmentPlans.filter(t => t.id !== itemId);
    return { ok: true };
  },

  // --- Reports / Analytics ---
  getReportsData() {
    requireAuth();
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidRevenue = invoices.filter((i) => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
    const treatmentTypes = {};
    appointments.forEach((a) => { treatmentTypes[a.type] = (treatmentTypes[a.type] || 0) + 1; });
    const monthlyRevenue = [
      { month: 'Sep', revenue: 1800 }, { month: 'Oct', revenue: 2450 },
      { month: 'Nov', revenue: 3100 }, { month: 'Dec', revenue: 2800 },
      { month: 'Jan', revenue: 3400 }, { month: 'Feb', revenue: paidRevenue },
    ];
    const weeklyAppointments = [
      { day: 'Mon', count: 6 }, { day: 'Tue', count: 8 },
      { day: 'Wed', count: 5 }, { day: 'Thu', count: 9 },
      { day: 'Fri', count: 7 }, { day: 'Sat', count: 3 },
    ];

    return {
      totalRevenue,
      paidRevenue,
      unpaidRevenue: totalRevenue - paidRevenue,
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter((a) => a.status === 'completed').length,
      treatmentTypes: Object.entries(treatmentTypes).map(([name, count]) => ({ name, count })),
      monthlyRevenue,
      weeklyAppointments,
      lowStockItems: stockItems.filter((s) => s.quantity <= s.minQuantity),
      recentPrescriptions: prescriptions.length,
    };
  },
};

