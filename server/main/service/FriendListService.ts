// server/main/service/FriendListService.ts
import Friend, { ContactFrequency } from '@/shared/classes/Friend';
import { NotificationHandler } from '@/shared/classes/NotificationHandler';
import Tag from '@/shared/classes/Tag';
import { NotificationType } from '@/shared/templates/NotificationMessages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FriendListAsyncStorageDAO } from '../dataaccess/asyncStorage/FriendListAsyncStorageDAO';
import { FriendListDAO } from '../dataaccess/interfaces/FriendListDAO';
import GroupListService from './GroupListService';

class FriendListService {

    friendList: Friend[];
    private storage: FriendListDAO;
    
    constructor() {
        this.storage = new FriendListAsyncStorageDAO();
        this.friendList = [];
    }

    async refreshService(): Promise<void> {
        // this.clearAllFriends();
        this.friendList = await this.storage.loadFriendList();
    }

    getSortedFriendList(compareFunction?: (a: Friend, b: Friend) => number): Friend[] {
        const sortedFriends = [...this.friendList].sort(compareFunction);
        return sortedFriends;
    }

    async addFriend(friend: Friend): Promise<void> {
        this.friendList.push(friend);
        await this.storage.saveFriendList(this.friendList);
    }

    findFriend(id: string | string[]): Friend | undefined {
        return this.friendList.find(friend => friend.id === id);
    }

    formatDate(date: Date) {
        try {
            if (date != null ) {
                const formatted = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                return formatted;
            }
            return null;
        } catch (e) {
            console.error("From formatDate.FriendListItem:", e);
        }
    }

    async pushContact(friend: Friend): Promise<void> {
        const target = this.friendList.find(f => f.id === friend.id);
        if (target) {
            try {
                target.pushContact();
                await this.updateNotificationSent(target);
                await this.storage.saveFriendList(this.friendList);
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log('Friend not found');
        }
    }

    async addContact(id: string, date: Date): Promise<void> {
        const target = this.friendList.find(f => f.id === id);
        if (target) {
            try {
                target.addContact(date);
                await this.storage.saveFriendList(this.friendList);
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log('Friend not found');
        }
    }

    async updateNotificationSent(friend: Friend): Promise<void> {
        // Cancel the old notification if it exists
        NotificationHandler.cancelNotification(friend.id);

        // Schedule the new notification for 30 days from now
        await NotificationHandler.scheduleNotification(friend, 30, NotificationType.ThirtyDayReminder);
    }

    async removeFriend(friend: Friend): Promise<void> {
        this.friendList = this.friendList.filter(f => f.id !== friend.id);
        await this.storage.saveFriendList(this.friendList);
        
        // Remove friend from all groups
        await GroupListService.removeFriendFromAllGroups(friend);
    }

    async removeLastContact(id: string): Promise<void> {
        const target = this.friendList.find(f => f.id === id);
        if (target) {
            target.removeLastContact();
            await this.storage.saveFriendList(this.friendList);
        }
    }

    async removeContact(id: string, date: Date) {
        const target = this.friendList.find(f => f.id === id);
        if (target) {
            target.removeContact(date);
            await this.storage.saveFriendList(this.friendList);
        }
    }

    async updateNotes(id: string, notes: string) {
        const target = this.friendList.find(f => f.id === id);
        if (target) {
            target.setNote(notes);
            await this.storage.saveFriendList(this.friendList);
        }
    }

    async clearAllFriends(): Promise<void> {
        await AsyncStorage.removeItem('friendList');
    }

    async getAllTags(): Promise<Tag[]> {
        const tagMap = new Map<string, Tag>();
    
        for (const friend of this.friendList) {
            for (const tag of friend.tags) {
                if (!tagMap.has(tag.id)) {
                    tagMap.set(tag.id, tag);
                }
            }
        }
    
        return Array.from(tagMap.values());
    }

    async updateProfilePhoto(id: string, uri: string) {
        const target = this.friendList.find(f => f.id === id);
        if (target) {
            target.profilePhotoUri = uri;
            await this.storage.saveFriendList(this.friendList);
        } else {
            console.warn(`Friend with ID ${id} not found for profile photo update.`);
        }
    }    

    async updateContactFrequency(id: string, frequency: ContactFrequency) {
        const target = this.friendList.find(f => f.id === id);
        if (target) {
            target.contactFrequency = frequency;
            await this.storage.saveFriendList(this.friendList);
        } else {
            console.warn(`Friend with ID ${id} not found for contact frequency update.`);
        }
    }

    async addTagToFriend(id: string, tag: Tag) {
        const target = this.friendList.find(f => f.id === id);
        if (target) {
            const alreadyHasTag = target.tags.some(existing => existing.id === tag.id);
            if (!alreadyHasTag) {
                target.tags.push(tag);
                await this.storage.saveFriendList(this.friendList);
            }
        } else {
            console.warn(`Friend with ID ${id} not found for tag addition.`);
        }
    }

    async removeTagFromFriend(id: string, tagId: string) {
        const target = this.friendList.find(f => f.id === id);
        if (target) {
            target.tags = target.tags.filter(tag => tag.id !== tagId);
            await this.storage.saveFriendList(this.friendList);
        } else {
            console.warn(`Friend with ID ${id} not found for tag removal.`);
        }
    }
}

const service = new FriendListService();
export default service;