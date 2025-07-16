import service from '@/server/main/service/FriendListService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Friend from '../../shared/classes/Friend.js';
import Name from '../../shared/classes/Name.js';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
}));

describe('FriendListManager', () => {
    let friend: Friend;

    beforeEach(async () => {
        friend = new Friend(new Name('John', 'Doe'));
    });

    it('should add a friend to the list', async () => {
        await service.addFriend(friend);
        expect(service.friendList.length).toBe(1);
        expect(service.friendList[0].name.firstName).toBe('John');
        expect(service.friendList[0].name.lastName).toBe('Doe');
        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should add a contact to a friend', async () => {
        await service.addFriend(friend);
        await service.pushContact(friend);

        // expect(friend.addContact).toHaveBeenCalled();
        expect(service.friendList[0].contacts.length).toBe(1);
        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should remove a friend from the list', async () => {
        await service.addFriend(friend);
        expect(service.friendList.length).toBe(1);
        await service.removeFriend(friend);
        expect(service.friendList.length).toBe(0);
    });

    it('should remove the most recent contact from the list', async () => {
        await service.addFriend(friend);
        await service.pushContact(friend);
        expect(service.friendList[0].contacts.length).toBe(1);
        await service.removeLastContact(friend.id);
        expect(service.friendList[0].contacts.length).toBe(0);
    })
})