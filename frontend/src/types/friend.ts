import z from "zod";

export interface FriendPreview {
  id: string;
  username: string;
  profilePath: string | null;
  friendStatus: string | null;
}

export const fetchFriendPreviewSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  profilePath: z.string().nullable(),
  friendStatus: z.string().nullable(),
});

export const fetchFriendPreviewsSchema = z.array(
  z.object({
    id: z.uuid(),
    username: z.string(),
    profilePath: z.string().nullable(),
  }),
);
