import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().cuid(),
  authId: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  creci: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

export const memberSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  organizationId: z.string().cuid(),
  role: z.enum(['SUPER_ADMIN', 'OWNER', 'ADMIN', 'BROKER', 'VIEWER']),
  isActive: z.boolean(),
  joinedAt: z.date(),
});

export type Member = z.infer<typeof memberSchema>;

export const inviteMemberDto = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'BROKER', 'VIEWER']).default('BROKER'),
});

export type InviteMemberDto = z.infer<typeof inviteMemberDto>;
