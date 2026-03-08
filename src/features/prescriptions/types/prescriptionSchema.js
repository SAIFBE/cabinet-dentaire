import { z } from 'zod';

export const medicationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Le nom du médicament est requis"),
  dosage: z.string().min(1, "Le dosage est requis (ex: 500mg)"),
  form: z.string().min(1, "La forme est requise (ex: Comprimé)"),
  frequency: z.string().min(1, "La posologie est requise (ex: 3 fois/jour)"),
  duration: z.string().min(1, "La durée est requise (ex: 5 jours)"),
  instructions: z.string().optional()
});

export const prescriptionSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().min(1, "Le patient est requis"),
  practitionerId: z.string().optional(), // Inferred from Auth context
  date: z.string().min(1, "La date est requise"),
  status: z.enum(['draft', 'finalized', 'printed']).default('draft'),
  templateType: z.string().nullable().optional(),
  generalInstructions: z.string().optional(),
  notes: z.string().optional(),
  medications: z.array(medicationSchema).min(1, "Au moins un médicament est requis"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
