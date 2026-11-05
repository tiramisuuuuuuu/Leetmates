import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/apiHelper";
import { fetchFriendsSchema, type Friend } from "../types/friend";
import { useFriendsCanvas } from "../store/friendsCanvasStore";

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

        initFriends(parsed.data);
        const friendsDict: Record<string, Friend> = {};
        for (const friend of parsed.data) {
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
