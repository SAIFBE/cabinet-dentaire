import { z } from 'zod';

export const stockSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100),
  category: z.string().min(1, 'Category is required'),
  quantity: z.coerce.number().int().min(0, 'Quantity must be 0 or more'),
  minQuantity: z.coerce.number().int().min(1, 'Minimum quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required').max(30),
  unitPrice: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  supplier: z.string().min(1, 'Supplier is required').max(100),
  expiryDate: z.string().optional().or(z.literal('')),
});
