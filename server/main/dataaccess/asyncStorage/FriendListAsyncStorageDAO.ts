import Friend from '@/shared/classes/Friend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FriendListDAO } from '../interfaces/FriendListDAO';

export class FriendListAsyncStorageDAO implements FriendListDAO {
    private storageKey = 'friendList';

    async saveFriendList(friendList: Friend[]): Promise<void> {
        if (!Array.isArray(friendList)) {
            throw new Error('Invalid friend list: must be an array');
        }
        try {
            const serialized = JSON.stringify(friendList);
            await AsyncStorage.setItem(this.storageKey, serialized);
        } catch (e) {
            throw new Error(`Failed to save friend list: ${e}`);
        }
    }

    async loadFriendList(): Promise<Friend[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(this.storageKey);
            if (jsonValue === null) {
                return []; // Fresh start if no data
            }
            const parsed = JSON.parse(jsonValue);
            if (!Array.isArray(parsed)) {
                throw new Error('Corrupted data: friend list is not an array');
            }
            return parsed.map((obj: any) => Friend.fromJson(obj));
        } catch (e) {
            throw new Error(`Failed to load friend list: ${e}`);
        }
    }

    // New method to verify storage is working
    async checkStorageHealth(): Promise<boolean> {
        try {
            await AsyncStorage.setItem('test_key', 'test');
            await AsyncStorage.removeItem('test_key');
            return true;
        } catch (e) {
            return false;
        }
    }
}