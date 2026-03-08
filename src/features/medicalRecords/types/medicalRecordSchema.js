import { z } from 'zod';

export const alertSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['ALLERGY', 'CONDITION', 'MEDICATION', 'OTHER']),
  severity: z.enum(['info', 'warning', 'critical']),
  description: z.string().min(2, "La description est requise"),
  status: z.enum(['active', 'resolved']).default('active'),
  createdAt: z.string().optional()
});

export const backgroundMedicationSchema = z.string().min(2);

export const medicalProfileSchema = z.object({
  patientId: z.string(),
  allergies: z.array(z.string()).default([]),
  chronicConditions: z.array(z.string()).default([]),
  surgicalHistory: z.string().optional(),
  backgroundMedications: z.array(backgroundMedicationSchema).default([]),
  dentalHistory: z.string().optional(),
  riskFactors: z.array(z.string()).default([]),
  alerts: z.array(alertSchema).default([])
});

export const consultationNoteSchema = z.object({
  id: z.string().optional(),
  patientId: z.string(),
  practitionerId: z.string(),
  date: z.string().optional(),
  chiefComplaint: z.string().min(2, "Le motif est requis"),
  symptoms: z.string().optional(),
  observations: z.string().optional(),
  clinicalAssessment: z.string().optional(),
  performedTreatments: z.string().optional(),
  followUpRecommendation: z.string().optional(),
  linkedRadiologyIds: z.array(z.string()).default([]),
  linkedPrescriptionIds: z.array(z.string()).default([]),
  linkedTeeth: z.array(z.string()).default([]), 
  status: z.enum(['draft', 'finalized', 'archived']).default('draft'),
});

export const treatmentPlanItemSchema = z.object({
  id: z.string().optional(),
  patientId: z.string(),
  toothNumber: z.string().optional(),
  treatmentCode: z.string().optional(), // Could be a standard code or free text
  description: z.string().min(2, "La description du soin est requise"),
  status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']).default('planned'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  createdAt: z.string().optional(),
  notes: z.string().optional()
});
