import { z } from 'zod';

export const organizationSchema = z.object({
  id: z.string().cuid(),
  slug: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  personType: z.enum(['INDIVIDUAL', 'COMPANY']),
  cpf: z.string().nullable().optional(),
  ownerName: z.string().nullable().optional(),
  cnpj: z.string().nullable().optional(),
  legalName: z.string().nullable().optional(),
  tradeName: z.string().nullable().optional(),
  stateReg: z.string().nullable().optional(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  planId: z.string(),
  status: z.enum(['TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED']),
  trialEndsAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Organization = z.infer<typeof organizationSchema>;

export const createOrganizationDto = organizationSchema.omit({
  id: true,
  status: true,
  trialEndsAt: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateOrganizationDto = z.infer<typeof createOrganizationDto>;
export type UpdateOrganizationDto = Partial<CreateOrganizationDto>;
