// server/main/service/EventService.ts
import Event from '@/shared/classes/Event';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventAsyncStorageDAO } from '../dataaccess/asyncStorage/EventAsyncStorageDAO';
import { EventDAO } from '../dataaccess/interfaces/EventDAO';

class EventService {
    eventList: Event[];
    private storage: EventDAO;
    
    constructor() {
        this.storage = new EventAsyncStorageDAO();
        this.eventList = [];
    }

    async refreshService(): Promise<void> {
        this.eventList = await this.storage.loadEventList();
    }

    getSortedEventList(compareFunction?: (a: Event, b: Event) => number): Event[] {
        const defaultSort = (a: Event, b: Event) => b.date.getTime() - a.date.getTime();
        const sortedEvents = [...this.eventList].sort(compareFunction || defaultSort);
        return sortedEvents;
    }

    async addEvent(event: Event): Promise<void> {
        this.eventList.push(event);
        await this.storage.saveEventList(this.eventList);
    }

    async updateEvent(event: Event): Promise<void> {
        const index = this.eventList.findIndex(e => e.id === event.id);
        if (index !== -1) {
            this.eventList[index] = event;
            await this.storage.saveEventList(this.eventList);
        }
    }

    async removeEvent(eventId: string): Promise<void> {
        this.eventList = this.eventList.filter(e => e.id !== eventId);
        await this.storage.saveEventList(this.eventList);
    }

    findEvent(id: string): Event | undefined {
        return this.eventList.find(event => event.id === id);
    }

    getEventsForFriend(friendId: string): Event[] {
        return this.eventList.filter(event => event.friendIds.includes(friendId));
    }

    async updateEventPhoto(eventId: string, uri: string): Promise<void> {
        const event = this.findEvent(eventId);
        if (event) {
            event.setPhoto(uri);
            await this.storage.saveEventList(this.eventList);
        }
    }

    async clearAllEvents(): Promise<void> {
        await AsyncStorage.removeItem('eventList');
        this.eventList = [];
    }
}

const eventService = new EventService();
export default eventService;