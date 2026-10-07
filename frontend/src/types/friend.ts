import z from "zod";

export interface Friend {
  id: string;
  username: string;
  onLeetcode: boolean;
  leetcodeProblem: string | null;
  isFriend: boolean;
  lastActive: string;
}

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
