// server/main/service/GroupListService.ts
import { GroupListStorageDAO } from "@/server/main/dataaccess/asyncStorage/GroupListStorageDAO";
import { GroupListDAO } from "@/server/main/dataaccess/interfaces/GroupListDAO";
import Friend from "@/shared/classes/Friend";
import Group from "@/shared/classes/Group";

class GroupListService {
    private list: Group[] = [];
    private storage: GroupListDAO = new GroupListStorageDAO();

    constructor() {
        this.refreshService();
    }

    async refreshService(): Promise<void> {
        this.list = await this.storage.loadGroupList();
    }

    getGroupList(): Group[] {
        return [...this.list];
    }

    async addGroup(name: string): Promise<void> {
        if (!name.trim()) return;
        this.list.push(new Group(name));
        await this.storage.saveGroupList(this.list);
    }

    async removeGroup(groupName: string): Promise<void> {
        this.list = this.list.filter(g => g.name !== groupName);
        await this.storage.saveGroupList(this.list);
    }

    getGroupByName(name: string): Group | undefined {
        return this.list.find(group => group.name === name);
    }

    async addFriendToGroup(groupName: string, friend: Friend): Promise<void> {
        const group = this.getGroupByName(groupName);
        if (group) {
            group.addFriend(friend);
            await this.storage.saveGroupList(this.list);
        }
    }

    async removeFriendFromGroup(groupName: string, friend: Friend): Promise<void> {
        const group = this.getGroupByName(groupName);
        if (group) {
            group.removeFriend(friend);
            await this.storage.saveGroupList(this.list);
        }
    }

    async removeFriendFromAllGroups(friend: Friend): Promise<void> {
        let updated = false;
        this.list.forEach(group => {
            if (group.hasFriend(friend)) {
                group.removeFriend(friend);
                updated = true;
            }
        });
        
        if (updated) {
            await this.storage.saveGroupList(this.list);
        }
    }

    async updateGroupPhoto(groupName: string, photoUri: string): Promise<void> {
        const group = this.getGroupByName(groupName);
        if (group) {
            group.photoUri = photoUri;
            await this.storage.saveGroupList(this.list);
        }
    }
}

const service = new GroupListService();
export default service;