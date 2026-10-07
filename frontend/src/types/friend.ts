export interface Friend {
  uid: number;
  username: string;
  onLeetcode: boolean;
  leetcodeProblem: string | null;
  isFriend: boolean;
  lastActive: string;
}

export interface FriendPreview {
  uid: number;
  username: string;
  friendStatus: string;
}
