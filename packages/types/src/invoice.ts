import { z } from 'zod';

export const invoiceSchema = z.object({
  id: z.string().cuid(),
  organizationId: z.string().cuid(),
  stripeInvoiceId: z.string().nullable().optional(),
  amount: z.number().nonnegative(),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']),
  method: z.enum(['CARD', 'PIX']),
  dueAt: z.date(),
  paidAt: z.date().nullable().optional(),
  pdfUrl: z.string().url().nullable().optional(),
  createdAt: z.date(),
});

export type Invoice = z.infer<typeof invoiceSchema>;
