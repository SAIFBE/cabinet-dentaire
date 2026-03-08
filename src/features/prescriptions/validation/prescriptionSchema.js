import { z } from 'zod';

const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  duration: z.string().min(1, 'Duration is required'),
  instructions: z.string().optional().default(''),
});

export const prescriptionSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorName: z.string().min(1, 'Doctor name is required'),
  medications: z.array(medicationSchema).min(1, 'At least one medication is required'),
  notes: z.string().max(1000, 'Notes must be 1000 characters or fewer').optional().default(''),
});
