// shared/classes/Friend.ts
import uuid from 'react-native-uuid';
import Name from './Name';
import Tag from './Tag';

export enum ContactFrequency {
    DAILY = 1,
    EVERY_3_DAYS = 3,
    WEEKLY = 7,
    BIWEEKLY = 14,
    MONTHLY = 30,
    BIMONTHLY = 60,
    QUARTERLY = 90,
    BIANNUALLY = 180,
    YEARLY = 365
}

class Friend {
    id: string;
    notes: string;
    name: Name;
    contacts: Date[];
    notificationId?: string;
    profilePhotoUri?: string;
    contactFrequency: ContactFrequency;
    tags: Tag[];

    constructor(name: Name, description: string = '') {
        this.id = uuid.v4() as string;
        this.name = name;
        this.contacts = [];
        this.notes = description;
        this.contactFrequency = ContactFrequency.MONTHLY;
        this.tags = [];
    }

    static fromJson(obj: any): Friend {
        const name = new Name(obj.name.firstName, obj.name.lastName);
        const friend = new Friend(name);
        friend.id = obj.id;
        friend.contacts = (obj.contacts || []).map((c: Date) => new Date(c));
        friend.notes = obj.notes ?? '';
        friend.notificationId = obj.notificationId;
        friend.profilePhotoUri = obj.profilePhotoUri;
        friend.contactFrequency = obj.contactFrequency || ContactFrequency.MONTHLY;
        friend.tags = (obj.tags || []).map((tag: any) => Tag.fromJson(tag));
        return friend;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            contacts: this.contacts,
            notes: this.notes,
            notificationId: this.notificationId,
            profilePhotoUri: this.profilePhotoUri,
            contactFrequency: this.contactFrequency,
            tags: this.tags,
        };
    }

    pushContact(): void {
        const date = new Date();
        this.contacts.push(date);
    }

    addContact(date: Date): void {
        const newContacts: Date[] = [];
    
        let inserted = false;
        for (let i = 0; i < this.contacts.length; i++) {
            const current = new Date(this.contacts[i]);
    
            if (!inserted && date < current) {
                newContacts.push(date);
                inserted = true;
            }
            newContacts.push(current);
        }
    
        if (!inserted) {
            newContacts.push(date);
        }
    
        this.contacts = newContacts;
    }

    getLastContact(): Date | null {
        if (this.contacts.length == 0) {
            return null;
        }
        return this.contacts[this.contacts.length - 1];
    }

    removeLastContact(): void {
        this.contacts.pop();
    }

    removeContact(date: Date): void {
        this.contacts = this.contacts.filter(d => d.getTime() !== date.getTime());
    }

    setNote(notes: string): void {
        this.notes = notes;
    }

    getContactProgress(): number {
        const lastContact = this.getLastContact();
        if (!lastContact) return 1; // Show as overdue if no contacts

        const daysSinceContact = Math.floor((Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
        const progress = Math.min(daysSinceContact / this.contactFrequency, 1);
        return progress;
    }

    isOverdue(): boolean {
        const lastContact = this.getLastContact();
        if (!lastContact) return true;

        const daysSinceContact = Math.floor((Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceContact >= this.contactFrequency;
    }

    addTag(tag: Tag): void {
        if (!this.tags.find(t => t.id === tag.id)) {
            this.tags.push(tag);
        }
    }

    removeTag(tagId: string): void {
        this.tags = this.tags.filter(tag => tag.id !== tagId);
    }

    setProfilePhoto(uri: string): void {
        this.profilePhotoUri = uri;
    }

    setContactFrequency(frequency: ContactFrequency): void {
        this.contactFrequency = frequency;
    }

}

export default Friend;