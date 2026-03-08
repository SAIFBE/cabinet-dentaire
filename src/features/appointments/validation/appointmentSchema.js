import { z } from 'zod';

export const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Veuillez sélectionner un patient'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  type: z.string().min(1, 'Appointment type is required'),
  notes: z.string().max(500).optional().default(''),
});
