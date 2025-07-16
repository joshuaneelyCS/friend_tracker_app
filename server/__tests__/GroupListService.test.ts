import service from '@/server/main/service/GroupListService';
import Group from '@/shared/classes/Group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Friend from '../../shared/classes/Friend';
import Name from '../../shared/classes/Name';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
}));

describe('GroupListService', () => {
    let friend: Friend;
    let group: Group;

    beforeEach(async () => {
        group = new Group('test_group');
        friend = new Friend(new Name('John', 'Doe'));
    });

    it('should add a group', async () => {
        await service.addGroup('test_group');
        expect(service.getGroupList().length).toBe(1);
        expect(service.getGroupList()[0].name).toBe('test_group');
        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
})