import z from 'zod';

export const updateUserSchema = z.object({
  username: z.string().optional(),
  leetcodeId: z.string().optional(),
  countryCode: z.string().nullable().optional(),
  currentStatus: z.string().nullable().optional(),
  matchingPreference: z.string().nullable().optional(),
  profilePath: z.string().nullable().optional(),
});
