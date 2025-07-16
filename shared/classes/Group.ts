// shared/classes/Group.ts
import Friend from "./Friend";

class Group {
    name: string;
    list: Friend[];
    photoUri?: string;

    constructor(name: string, list: Friend[] = [], photoUri?: string) {
        this.name = name;
        this.list = list;
        this.photoUri = photoUri;
    }

    toJSON(): any {
        return {
            name: this.name,
            list: this.list.map(friend => friend.toJSON()),
            photoUri: this.photoUri,
        };
    }

    static fromJSON(item: any): Group {
        const name = item.name;
        const list = (item.list || []).map((f: any) => Friend.fromJson(f));
        return new Group(name, list, item.photoUri);
    }

    addFriend(friend: Friend): void {
        if (!this.hasFriend(friend)) {
            this.list.push(friend);
        }
    }

    removeFriend(friend: Friend): void {
        this.list = this.list.filter(f => f.id !== friend.id);
    }

    hasFriend(friend: Friend): boolean {
        return this.list.some(f => f.id === friend.id);
    }
}

export default Group;