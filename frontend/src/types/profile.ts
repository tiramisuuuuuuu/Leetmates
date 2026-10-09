import z from "zod";

export interface Profile {
  username: string;
  profilePath: string | null;
  countryCode: string | null;
  currentStatus: string | null;
  matchingPreference: string;
  friendCode: string | null;
}

export const fetchProfileSchema = z.object({
  username: z.string(),
  profilePath: z.string().nullable(),
  countryCode: z.string().nullable(),
  currentStatus: z.string().nullable(),
  matchingPreference: z.string(),
  friendCode: z.string().nullable(),
});
