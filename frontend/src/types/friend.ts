export interface Friend {
  uid: number;
  username: string;
  onLeetcode: boolean;
  leetcodeProblem: string | null;
  isFriend: boolean;
  lastActive: string;
}

export interface User {
  uid: number;
  username: string;
  friendStatus: string;
}
