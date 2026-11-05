import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/apiHelper";
import { fetchFriendsSchema, type Friend } from "../types/friend";
import { useFriendsCanvas } from "../store/friendsCanvasStore";

const mockFriends: Friend[] = [
  {
    id: "00000000-0000-0000-0000-000000000000",
    username: "mochi",
    onLeetcode: true,
    leetcodeProblem: "Two Sum",
    isFriend: true,
    lastActive: "Now",
    profilePath: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000001",
    username: "Blade",
    onLeetcode: false,
    leetcodeProblem: null,
    isFriend: true,
    lastActive: "2 hrs ago",
    notificationsEnabled: false,
    profilePath: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    username: "Bob A.",
    onLeetcode: true,
    leetcodeProblem: "Linked List",
    isFriend: false,
    lastActive: "Now",
    profilePath: null,
  },
];

export function useFriends() {
  const initFriends = useFriendsCanvas((state) => state.initFriends);

  const { data: friends } = useQuery({
    queryKey: ["friends_list"],
    queryFn: async () => {
      try {
        const response = await apiFetch("/friends");
        const body = await response.json();
        const parsed = fetchFriendsSchema.safeParse(body);

        if (!parsed.success) {
          console.log("Error ", parsed.error.issues);
          throw "Zod Error";
        }

        const mockList = [...mockFriends, ...parsed.data];
        initFriends(mockList);

        const friendsDict: Record<string, Friend> = {};
        for (const friend of mockList) {
          friendsDict[friend.id] = friend;
        }
        return friendsDict;
      } catch (err) {
        console.error("Failed to fetch profile: ", err);
        return {};
      }
    },
    staleTime: Infinity,
  });

  return friends ? friends : {};
}
