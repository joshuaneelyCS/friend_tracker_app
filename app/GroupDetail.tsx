// app/(main)/GroupDetail.tsx
import FriendListService from '@/server/main/service/FriendListService';
import GroupListService from '@/server/main/service/GroupListService';
import Friend from '@/shared/classes/Friend';
import Group from '@/shared/classes/Group';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function GroupDetail() {
    const route = useRoute();
    const navigation = useNavigation();
    const { groupName } = route.params as { groupName: string };
    // Add Friends to Group UI
    const [isModalVisible, setModalVisible] = useState(false);

    const [group, setGroup] = useState<Group | null>(null);
    const [availableFriends, setAvailableFriends] = useState<Friend[]>([]);

    useEffect(() => {
        loadGroupData();
    }, []);

    const loadGroupData = async () => {
        await GroupListService.refreshService();
        await FriendListService.refreshService();
        
        const groupData = GroupListService.getGroupByName(groupName);
        setGroup(groupData || null);
        
        // Get friends not in this group
        const allFriends = FriendListService.getSortedFriendList();
        const friendsNotInGroup = allFriends.filter(friend => 
            !groupData?.hasFriend(friend)
        );
        setAvailableFriends(friendsNotInGroup);
    };

    const handleSelectPhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to select a photo.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            await GroupListService.updateGroupPhoto(groupName, result.assets[0].uri);
            loadGroupData();
        }
    };

    const handleRemoveFriend = (friend: Friend) => {
        Alert.alert(
            'Remove Friend',
            `Remove ${friend.name.firstName} ${friend.name.lastName} from ${groupName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        await GroupListService.removeFriendFromGroup(groupName, friend);
                        loadGroupData();
                    },
                },
            ]
        );
    };

    const handleAddFriends = () => {
        if (availableFriends.length === 0) {
          Alert.alert('No Friends Available', 'All your friends are already in this group or you have no friends to add.');
          return;
        }
        setModalVisible(true);
      };

    const renderFriendItem = ({ item }: { item: Friend }) => (
        <View style={styles.friendItem}>
            <Text style={styles.friendName}>
                {item.name.firstName} {item.name.lastName}
            </Text>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFriend(item)}
            >
                <Ionicons name="remove-circle" size={24} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    );

    if (!group) {
        return (
            <View style={styles.container}>
                <Text>Group not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>{group.name}</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Group Photo Section */}
            <View style={styles.photoSection}>
                <TouchableOpacity style={styles.photoContainer} onPress={handleSelectPhoto}>
                    {group.photoUri ? (
                        <Image source={{ uri: group.photoUri }} style={styles.groupPhoto} />
                    ) : (
                        <View style={styles.defaultPhoto}>
                            <Ionicons name="people" size={50} color="#666" />
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoButton} onPress={handleSelectPhoto}>
                    <Text style={styles.photoButtonText}>
                        {group.photoUri ? 'Change Photo' : 'Add Photo'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Members Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Members ({group.list.length})
                    </Text>
                    <TouchableOpacity style={styles.addButton} onPress={handleAddFriends}>
                        <Ionicons name="add" size={20} color="white" />
                        <Text style={styles.addButtonText}>Add Friends</Text>
                    </TouchableOpacity>
                </View>

                {group.list.length > 0 ? (
                    <FlatList
                        data={group.list}
                        renderItem={renderFriendItem}
                        keyExtractor={(item) => item.id}
                        style={styles.friendsList}
                    />
                ) : (
                    <Text style={styles.emptyText}>No members in this group yet.</Text>
                )}
            </View>
            
            {/* Select Friends to add to Group*/}
            {isModalVisible && (
            <View style={styles.modalOverlay}>
                <View style={styles.modal}>
                <Text style={styles.modalTitle}>Select Friends to Add</Text>
                <FlatList
                    data={availableFriends}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.modalItem}
                        onPress={async () => {
                        await GroupListService.addFriendToGroup(groupName, item);
                        loadGroupData();
                        setModalVisible(false);
                        }}
                    >
                        <Text>{item.name.firstName} {item.name.lastName}</Text>
                    </TouchableOpacity>
                    )}
                />
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>Cancel</Text>
                </TouchableOpacity>
                </View>
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 60,
        backgroundColor: '#f7d702',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    photoSection: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    photoContainer: {
        marginBottom: 10,
    },
    groupPhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    defaultPhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    photoButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    section: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#34C759',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    addButtonText: {
        color: 'white',
        marginLeft: 4,
        fontWeight: 'bold',
    },
    friendsList: {
        flex: 1,
    },
    friendItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f8f8f8',
        marginBottom: 8,
        borderRadius: 8,
    },
    friendName: {
        fontSize: 16,
        fontWeight: '500',
    },
    removeButton: {
        padding: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
        marginTop: 20,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      },
      modal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '60%',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      modalItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
      },      
});