// shared/classes/Tag.ts
import uuid from 'react-native-uuid';

class Tag {
    id: string;
    name: string;
    color: string;

    constructor(name: string, color?: string) {
        this.id = uuid.v4() as string;
        this.name = name;
        this.color = color || this.generateRandomColor();
    }

    static fromJson(obj: any): Tag {
        const tag = new Tag(obj.name, obj.color);
        tag.id = obj.id;
        return tag;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
        };
    }

    private generateRandomColor(): string {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

export default Tag;