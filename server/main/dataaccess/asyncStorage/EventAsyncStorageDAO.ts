// server/main/dataaccess/asyncStorage/EventAsyncStorageDAO.ts
import Event from '@/shared/classes/Event';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventDAO } from '../interfaces/EventDAO';

export class EventAsyncStorageDAO implements EventDAO {
    private storageKey = 'eventList';

    async saveEventList(eventList: Event[]): Promise<void> {
        if (!Array.isArray(eventList)) {
            throw new Error('Invalid event list: must be an array');
        }
        try {
            const serialized = JSON.stringify(eventList);
            await AsyncStorage.setItem(this.storageKey, serialized);
        } catch (e) {
            throw new Error(`Failed to save event list: ${e}`);
        }
    }

    async loadEventList(): Promise<Event[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(this.storageKey);
            if (jsonValue === null) {
                return [];
            }
            const parsed = JSON.parse(jsonValue);
            if (!Array.isArray(parsed)) {
                throw new Error('Corrupted data: event list is not an array');
            }
            return parsed.map((obj: any) => Event.fromJson(obj));
        } catch (e) {
            throw new Error(`Failed to load event list: ${e}`);
        }
    }
}