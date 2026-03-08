import { z } from 'zod';

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required').max(200),
  qty: z.coerce.number().min(1, 'Qty must be at least 1'),
  unitPrice: z.coerce.number().min(0.01, 'Unit price must be greater than 0'),
});

export const billingSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  appointmentId: z.string().optional().or(z.literal('')),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  taxRate: z.coerce.number().min(0).max(100).optional().default(0),
  discount: z.coerce.number().min(0).optional().default(0),
  notes: z.string().max(500).optional().default(''),
});

export const paymentSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  method: z.enum(['cash', 'card', 'transfer', 'cheque', 'insurance'], {
    required_error: 'Payment method is required',
  }),
  paidAt: z.string().min(1, 'Payment date is required'),
  reference: z.string().max(100).optional().default(''),
  note: z.string().max(300).optional().default(''),
});
