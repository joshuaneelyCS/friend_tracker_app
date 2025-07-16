// shared/classes/Event.ts
import uuid from 'react-native-uuid';

class Event {
    id: string;
    name: string;
    description: string;
    date: Date;
    time: string;
    photoUri?: string;
    friendIds: string[]; // Array of friend IDs involved in the event
    createdAt: Date;

    constructor(
        name: string, 
        description: string, 
        date: Date, 
        time: string, 
        friendIds: string[] = []
    ) {
        this.id = uuid.v4() as string;
        this.name = name;
        this.description = description;
        this.date = date;
        this.time = time;
        this.friendIds = friendIds;
        this.createdAt = new Date();
    }

    static fromJson(obj: any): Event {
        const event = new Event(
            obj.name,
            obj.description,
            new Date(obj.date),
            obj.time,
            obj.friendIds || []
        );
        event.id = obj.id;
        event.photoUri = obj.photoUri;
        event.createdAt = new Date(obj.createdAt);
        return event;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            date: this.date,
            time: this.time,
            photoUri: this.photoUri,
            friendIds: this.friendIds,
            createdAt: this.createdAt,
        };
    }

    setPhoto(uri: string): void {
        this.photoUri = uri;
    }

    addFriend(friendId: string): void {
        if (!this.friendIds.includes(friendId)) {
            this.friendIds.push(friendId);
        }
    }

    removeFriend(friendId: string): void {
        this.friendIds = this.friendIds.filter(id => id !== friendId);
    }

    updateDetails(name: string, description: string, date: Date, time: string): void {
        this.name = name;
        this.description = description;
        this.date = date;
        this.time = time;
    }
}

export default Event;