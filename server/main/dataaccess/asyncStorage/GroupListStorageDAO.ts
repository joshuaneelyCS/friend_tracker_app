import Group from "@/shared/classes/Group";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GroupListDAO } from "../interfaces/GroupListDAO";

export class GroupListStorageDAO implements GroupListDAO {
    private static readonly STORAGE_KEY = 'groupList';

    async loadGroupList(): Promise<Group[]> {
        try {
            const json = await AsyncStorage.getItem(GroupListStorageDAO.STORAGE_KEY);
            if (json) {
                const data = JSON.parse(json);
                // Assumes Group has a static fromJSON method for deserialization
                return data.map((item: any) => Group.fromJSON(item));
            }
            return [];
        } catch (error) {
            console.error('Error loading group list:', error);
            return [];
        }
    }

    async saveGroupList(groups: Group[]): Promise<void> {
        try {
            // Assumes Group has a toJSON method for serialization
            const json = JSON.stringify(groups.map(group => group.toJSON()));
            await AsyncStorage.setItem(GroupListStorageDAO.STORAGE_KEY, json);
        } catch (error) {
            console.error('Error saving group list:', error);
        }
    }
}