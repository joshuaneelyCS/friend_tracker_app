import friendListService from '@/server/main/service/FriendListService';
import ScoreService from '@/server/main/service/ScoreService';
import Friend from '@/shared/classes/Friend';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CircularProgress from '../common/CircularProgress';

const scoreService = new ScoreService();

export function FriendListItem({ friend, friendIndex, refresh }: { friend: Friend, friendIndex: number, refresh: () => void } ) {
    
    const [initialized, setInitialized] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        syncServices();
    }, []);

    async function syncServices() {
        try {
            await scoreService.init();
            setInitialized(true);
        } catch (e) {
            console.error('Error Initializing Manager', e);
        }
    }

    if (!initialized) {
        return null;
    }
    
    const undo = async () => {
        try {
            if (friend.getLastContact() === null) {
                Alert.alert('There are no contacts!');
                return;
            }
            await friendListService.removeLastContact(friend.id);
            await scoreService.decreaseScoreBy(50);
            Alert.alert('You removed previous contact. You lost 50 points.');
            refresh();
        } catch (e) {
            console.error('Error: FriendListItem' + e);
        }
    }

    const addFriendContact = async () => {
        try {
            if (friend.getLastContact() != null) {
                if (friendListService.formatDate(friend.getLastContact()!) === friendListService.formatDate(new Date())) {
                    Alert.alert('You already contacted this person today! Come back tomorrow.');
                    return;
                }
            }
            await friendListService.pushContact(friend);
            await scoreService.increaseScoreBy(50);
            Alert.alert('You added the contact. You gained 50 points!');
            refresh();
            syncServices();
        } catch (e) {
            console.error('Error: FriendListItem' + e);
        }
    }

    const progress = friend.getContactProgress();
    const isOverdue = friend.isOverdue();

    return (
        <TouchableOpacity style={styles.container} onPress={() => {router.push({
            pathname: '/FriendView',
            params: { id: friend.id }
          })}}>
            <View style={styles.card}>
                <View style={styles.leftSection}>
                    <View style={styles.profileContainer}>
                        {friend.profilePhotoUri ? (
                            <Image source={{ uri: friend.profilePhotoUri }} style={styles.profileImage} />
                        ) : (
                            <Image source={require('@/assets/images/no-profile-image.jpg')} style={styles.profileImage} />
                        )}
                        <View style={styles.progressOverlay}>
                            <CircularProgress 
                                progress={progress} 
                                size={60} 
                                strokeWidth={4} 
                                isOverdue={isOverdue}
                            />
                        </View>
                    </View>
                    <View style={styles.textInfo}>
                        <Text style={styles.name}>{friend.name.firstName} {friend.name.lastName}</Text>
                        {friend.contacts.length > 0 ? (
                            <Text>{friendListService.formatDate(friend.contacts[friend.contacts.length - 1])}</Text>
                        ) : (
                            <Text>Click to Add a Contact!</Text>
                        )}
                    </View>
                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity onPress={undo}>
                        <Ionicons name="refresh-outline" size={32} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={addFriendContact}>
                        <Ionicons name="add-circle-outline" size={32} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10,
    },
    card: {
        backgroundColor: '#D3D3D3',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileContainer: {
        position: 'relative',
        marginRight: 15,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    progressOverlay: {
        position: 'absolute',
        top: -5,
        left: -5,
    },
    textInfo: {
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
    },
    buttons: {
        flexDirection: 'row',
        gap: 10
    }
});