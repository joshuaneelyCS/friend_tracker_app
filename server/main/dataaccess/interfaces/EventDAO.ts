// server/main/dataaccess/interfaces/EventDAO.ts
import Event from '@/shared/classes/Event';

export interface EventDAO {
    saveEventList(eventList: Event[]): Promise<void>;
    loadEventList(): Promise<Event[]>;
}