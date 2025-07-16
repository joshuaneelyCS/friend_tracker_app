import Friend from "@/shared/classes/Friend";

export interface FriendListDAO {
   saveFriendList(friends: Friend[]): Promise<void>;
   loadFriendList(): Promise<Friend[]>; 
}