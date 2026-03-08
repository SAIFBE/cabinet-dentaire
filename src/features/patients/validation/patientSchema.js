import { z } from 'zod';

export const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required').max(20),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(1, 'Address is required').max(200),
  notes: z.string().max(500).optional().default(''),
  insurance: z.enum(['CNSS', 'CNOPS'], { required_error: 'Veuillez sélectionner une assurance' }),
});

