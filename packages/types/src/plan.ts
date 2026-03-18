import { z } from 'zod';

export const planSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  stripePriceId: z.string().nullable().optional(),
  maxUsers: z.number().int().nonnegative(),
  maxListings: z.number().int().nonnegative(),
  features: z.array(z.string()),
  price: z.number().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.date(),
});

export type Plan = z.infer<typeof planSchema>;
