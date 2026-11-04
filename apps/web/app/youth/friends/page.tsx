import React from "react";
import FriendsRoomClient from "./FriendsRoomClient";
import { CharacterId } from "@/lib/friends-data";

export default function TalkingAIFriendsRoomPage({
  searchParams,
}: {
  searchParams?: { friend?: string; listen?: string };
}) {
  const initialFriend = (searchParams?.friend as CharacterId) || "kai";
  const autoListen = searchParams?.listen === "true";

  return <FriendsRoomClient initialFriendId={initialFriend} autoListen={autoListen} />;
}
