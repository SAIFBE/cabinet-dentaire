import { z } from 'zod';

export const TOOTH_STATUSES = [
  'healthy', 'caries', 'filled', 'missing', 'crown', 'implant', 'root-canal',
];

export const AGE_CATEGORIES = ['child', 'adult', 'senior'];

export const toothUpdateSchema = z.object({
  toothNumber: z.coerce.number().int().min(11).max(85),
  status: z.enum(TOOTH_STATUSES, { errorMap: () => ({ message: 'Invalid tooth status' }) }),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional().default(''),
});

export const chartCreateSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  ageCategory: z.enum(AGE_CATEGORIES, { errorMap: () => ({ message: 'Invalid age category' }) }),
});
