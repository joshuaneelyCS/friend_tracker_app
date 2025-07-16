// app/(stack)/FriendView.tsx
import CameraComponent from '@/components/camera/CameraComponent';
import CircularProgress from '@/components/common/CircularProgress';
import { ContactListItem } from '@/components/contactList/ContactListItem';
import eventService from '@/server/main/service/EventService';
import service from '@/server/main/service/FriendListService';
import Event from '@/shared/classes/Event';
import Friend, { ContactFrequency } from '@/shared/classes/Friend';
import Tag from '@/shared/classes/Tag';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Modal, Platform, ScrollView as RNScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const FREQUENCY_OPTIONS = [
    { label: 'Daily', value: ContactFrequency.DAILY },
    { label: 'Every 3 Days', value: ContactFrequency.EVERY_3_DAYS },
    { label: 'Weekly', value: ContactFrequency.WEEKLY },
    { label: 'Bi-weekly', value: ContactFrequency.BIWEEKLY },
    { label: 'Monthly', value: ContactFrequency.MONTHLY },
    { label: 'Bi-monthly', value: ContactFrequency.BIMONTHLY },
    { label: 'Quarterly', value: ContactFrequency.QUARTERLY },
    { label: 'Bi-annually', value: ContactFrequency.BIANNUALLY },
    { label: 'Yearly', value: ContactFrequency.YEARLY },
];

export default function FriendView() {
    const { id } = useLocalSearchParams();
    const [friend, setFriend] = useState<Friend | undefined>(undefined);
    const [noteText, setNoteText] = useState<string>('');
    const [showCamera, setShowCamera] = useState(false);
    const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [showTagInput, setShowTagInput] = useState(false);
    const [suggestedTags, setSuggestedTags] = useState<Tag[]>([]);
    const [friendEvents, setFriendEvents] = useState<Event[]>([]);
    const [allFriends, setAllFriends] = useState<Friend[]>([]);
    const [showFriendSelector, setShowFriendSelector] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadFriend();
        loadSuggestedTags();
        loadFriendEvents();
        loadAllFriends();
    }, []);

    useFocusEffect(
        useCallback(() => {
          loadFriendEvents(); // <-- re-fetch events when screen is focused again
        }, [])
      );

    // ... existing functions ...

    async function loadFriendEvents() {
        await eventService.refreshService();
        const events = eventService.getEventsForFriend(id as string);
        setFriendEvents(events);
    }

    async function loadAllFriends() {
        await service.refreshService();
        const friends = service.getSortedFriendList();
        setAllFriends(friends);
    }

    const formatEventDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const openDatePicker = () => {
        setShowDatePicker(true);
    }

    const onDateSelect = async (event: any, date?: Date) => {

        setShowDatePicker(false);
    
        if (!date) return;
    
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Strip time from today's date
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0); // Normalize selected date
    
        const isInFuture = selectedDate > today;
        const isDuplicate = friend?.contacts.some(
            (d) => new Date(d).toDateString() === selectedDate.toDateString()
        );
    
        if (isInFuture) {
            Alert.alert("Invalid Date", "You can't log a contact in the future.");
            return;
        }
    
        if (isDuplicate) {
            Alert.alert("Duplicate Entry", "This contact date is already recorded.");
            return;
        }
    
        createContact(selectedDate);
    };

    useEffect(() => {
        loadFriend();
        loadSuggestedTags();
    }, []);
    
    async function loadFriend() {
        const foundFriend = service.findFriend(id as string);
        if (foundFriend) {
            const updatedFriend = Object.assign(Object.create(Object.getPrototypeOf(foundFriend)), foundFriend);
            setFriend(updatedFriend);
            setNoteText(updatedFriend.notes ?? '');
        }
    }

    async function loadSuggestedTags() {
        const allTags = await service.getAllTags();
        setSuggestedTags(allTags);
    }

    if (!friend) {
        return <Text>Loading friend data...</Text>;
    }

    const saveAndGoBack = async () => {
        await service.updateNotes(id as string, noteText);
        router.back();
    }

    const removeFriend = async () => {
        try {
            await service.removeFriend(friend);
            let message = 'You removed ' + friend.name.firstName + ' from your friend list';
            Alert.alert(message);
            router.back();
        } catch (e) {
            console.error('Error: FriendListItem' + e);
        }
    }

    const createContact = async (date: Date) => {
        await service.addContact(id as string, date);
        await loadFriend();
    }

    const handlePhotoTaken = async (uri: string) => {
        await service.updateProfilePhoto(id as string, uri);
        setShowCamera(false);
        await loadFriend();
    }

    const updateContactFrequency = async (frequency: ContactFrequency) => {
        await service.updateContactFrequency(id as string, frequency);
        setShowFrequencyPicker(false);
        await loadFriend();
    }

    const addTag = async (tag: Tag) => {
        await service.addTagToFriend(id as string, tag);
        await loadFriend();
        await loadSuggestedTags();
    }

    const createNewTag = async () => {
        if (newTagName.trim()) {
            const newTag = new Tag(newTagName.trim());
            await addTag(newTag);
            setNewTagName('');
            setShowTagInput(false);
        }
    }

    const removeTag = async (tagId: string) => {
        await service.removeTagFromFriend(id as string, tagId);
        await loadFriend();
    }

    const progress = friend.getContactProgress();
    const isOverdue = friend.isOverdue();
    const currentFrequencyLabel = FREQUENCY_OPTIONS.find(opt => opt.value === friend.contactFrequency)?.label || 'Monthly';

    return (
        <ScrollView style={styles.scrollViewContainer}>
            <View style={styles.container}>
                {/* ... existing header and content sections ... */}

                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={saveAndGoBack}>
                        <Text style={styles.backButton}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={removeFriend}>
                        <Text style={styles.removeButton}>Remove</Text>
                    </TouchableOpacity>
                </View>
        
                {/* CONTENT */}
                <View style={styles.content}>
                    {/* Profile Image with Progress Ring */}
                    <View style={styles.profileContainer}>
                        <TouchableOpacity onPress={() => setShowCamera(true)}>
                            {friend.profilePhotoUri ? (
                                <Image style={styles.profileImage} source={{ uri: friend.profilePhotoUri }} />
                            ) : (
                                <Image style={styles.profileImage} source={require('@/assets/images/no-profile-image.jpg')} />
                            )}
                        </TouchableOpacity>
                        <View style={styles.progressRing}>
                            <CircularProgress 
                                progress={progress} 
                                size={120} 
                                strokeWidth={6} 
                                isOverdue={isOverdue}
                            />
                        </View>
                    </View>

                    {/* Name */}
                    <Text style={styles.nameText}>{friend.name.firstName} {friend.name.lastName}</Text>

                    {/* Contact Frequency */}
                    <TouchableOpacity style={styles.frequencyButton} onPress={() => setShowFrequencyPicker(true)}>
                        <Text style={styles.frequencyText}>Contact Frequency: {currentFrequencyLabel}</Text>
                        <Ionicons name="chevron-down" size={20} color="black" />
                    </TouchableOpacity>

                    {/* Tags Section */}
                    <View style={styles.tagsSection}>
                        <View style={styles.tagsHeader}>
                            <Text style={styles.tagsTitle}>Tags</Text>
                            <TouchableOpacity onPress={() => setShowTagInput(true)}>
                                <Ionicons name="add-circle-outline" size={32} color="black" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.tagsContainer}>
                            {friend.tags.map((tag) => (
                                <View key={tag.id} style={[styles.tagCapsule, { backgroundColor: tag.color }]}>
                                    <Text style={styles.tagText}>{tag.name}</Text>
                                    <TouchableOpacity onPress={() => removeTag(tag.id)}>
                                        <Ionicons name="close" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        {/* Suggested Tags */}
                        {suggestedTags.length > 0 && (
                            <View style={styles.suggestedTagsContainer}>
                                <Text style={styles.suggestedTagsTitle}>Suggested:</Text>
                                <View style={styles.tagsContainer}>
                                    {suggestedTags
                                        .filter(suggestedTag => !friend.tags.find(friendTag => friendTag.id === suggestedTag.id))
                                        .map((tag) => (
                                            <TouchableOpacity 
                                                key={tag.id} 
                                                style={[styles.suggestedTagCapsule, { borderColor: tag.color }]}
                                                onPress={() => addTag(tag)}
                                            >
                                                <Text style={[styles.suggestedTagText, { color: tag.color }]}>{tag.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Notes */}
                    <TextInput
                    placeholder="Notes"
                    style={styles.notes}
                    value={noteText}
                    onChangeText={setNoteText}
                    onBlur={async () => {
                        if (noteText.trim() !== friend?.notes?.trim()) {
                        await service.updateNotes(id as string, noteText);
                        }
                    }}
                    multiline
                    numberOfLines={8}
                    />
                </View>

                {/* Events Section */}
                <View style={styles.eventsSection}>
                    <View style={styles.eventsHeader}>
                        <Text style={styles.eventsTitle}>Events</Text>
                        <TouchableOpacity onPress={() => {router.push({
                            pathname: '/(stack)/EventCreateScreen',
                            params: {
                                friendId: id,
                            },
                            });
                            }}>
                            <Ionicons name="add-circle-outline" size={32} color="black" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.eventsScrollView} contentContainerStyle={styles.eventsScrollContent}>
                        {friendEvents.map((event) => (
                            <View key={event.id} style={styles.eventItem}>
                                <View style={styles.eventHeader}>
                                    <Text style={styles.eventName}>{event.name}</Text>
                                    <Text style={styles.eventDate}>{formatEventDate(event.date)}</Text>
                                </View>
                                {event.time && <Text style={styles.eventTime}>{event.time}</Text>}
                                {event.description && <Text style={styles.eventDescription}>{event.description}</Text>}
                                <Text style={styles.eventParticipants}>
                                    {event.friendIds.length} participant{event.friendIds.length !== 1 ? 's' : ''}
                                </Text>
                            </View>
                        ))}
                        {friendEvents.length === 0 && (
                            <Text style={styles.noEventsText}>No events scheduled</Text>
                        )}
                    </ScrollView>
                </View>

                {/* Contact History */}
                <View style={styles.history}>
                    <View style={styles.contactHistoryHeader}>
                        <Text style={styles.contactTitle}>Contact History</Text>
                        <TouchableOpacity onPress={openDatePicker}>
                            <Ionicons name="add-circle-outline" size={32} color="black" />
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={onDateSelect}
                        />}
                    
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                        {friend.contacts.map((date, index) => (
                            <ContactListItem key={index} date={date} friendId={id as string} refresh={loadFriend}/>
                        ))}
                    </ScrollView>
                </View>

                {/* Camera Modal */}
                <Modal visible={showCamera} animationType="slide">
                    <CameraComponent 
                        onPhotoTaken={handlePhotoTaken}
                        onClose={() => setShowCamera(false)}
                    />
                </Modal>

                {/* Frequency Picker Modal */}
                <Modal visible={showFrequencyPicker} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Contact Frequency</Text>
                            <RNScrollView style={styles.frequencyList}>
                                {FREQUENCY_OPTIONS.map((option) => (
                                    <TouchableOpacity 
                                        key={option.value}
                                        style={styles.frequencyOption}
                                        onPress={() => updateContactFrequency(option.value)}
                                    >
                                        <Text style={styles.frequencyOptionText}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </RNScrollView>
                            <TouchableOpacity 
                                style={styles.cancelButton}
                                onPress={() => setShowFrequencyPicker(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Tag Input Modal */}
                <Modal visible={showTagInput} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add New Tag</Text>
                            <TextInput
                                style={styles.tagInput}
                                placeholder="Tag name"
                                value={newTagName}
                                onChangeText={setNewTagName}
                                autoFocus
                            />
                            <View style={styles.tagModalButtons}>
                                <TouchableOpacity 
                                    style={styles.tagModalButton}
                                    onPress={createNewTag}
                                >
                                    <Text style={styles.tagModalButtonText}>Add</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.tagModalButton, styles.cancelTagButton]}
                                    onPress={() => {
                                        setShowTagInput(false);
                                        setNewTagName('');
                                    }}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {
        fontSize: 16,
        color: '#007AFF',
    },
    removeButton: {
        color: 'red',
        fontSize: 16,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    profileContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#ccc',
    },
    progressRing: {
        position: 'absolute',
        top: -10,
        left: -10,
    },
    nameText: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingVertical: 10,
    },
    frequencyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        
    },
    frequencyText: {
        fontSize: 16,
        marginRight: 10,
    },
    tagsSection: {
        width: '100%',
        marginBottom: 20,
    },
    tagsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    tagsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagCapsule: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    tagText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    suggestedTagsContainer: {
        marginTop: 15,
    },
    suggestedTagsTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    suggestedTagCapsule: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
    },
    suggestedTagText: {
        fontSize: 14,
        fontWeight: '500',
    },
    notes: {
        width: '100%',
        marginBottom: 10,
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        borderColor: 'gray',
        backgroundColor: 'white',
        textAlignVertical: 'top',
    },
    history: {
        alignItems: 'center',
        gap: 20,
        flex: 1,
        width: '100%',
        marginTop: 20,
    },
    contactHistoryHeader: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    contactTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    scrollView: {
        width: '100%',
        maxHeight: 300,
        borderRadius: 20,
    },
    scrollViewContent: {
        paddingVertical: 10,
        gap: 10,
        backgroundColor: '#DDDDDD',
        borderRadius: 20,
        padding: 10,
        
    },
    addContactButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    frequencyList: {
        width: '100%',
        maxHeight: 300,
        marginBottom: 10,
    },
    frequencyOption: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    frequencyOptionText: {
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
    tagInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    tagModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    tagModalButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    cancelTagButton: {
        backgroundColor: '#aaa',
    },
    tagModalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    eventsSection: {
        width: '100%',
        marginBottom: 20,
    },
    eventsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    eventsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    eventsScrollView: {
        width: '100%',
        maxHeight: 200,
        borderRadius: 20,
        
    },
    eventsScrollContent: {
        paddingVertical: 10,
        gap: 10,
        backgroundColor: '#DDDDDD',
        borderRadius: 20,
        padding: 10,
    },
    eventItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 5,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    eventName: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    eventDate: {
        fontSize: 14,
        color: '#666',
    },
    eventTime: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    eventDescription: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    eventParticipants: {
        fontSize: 12,
        color: '#999',
    },
    noEventsText: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
        padding: 20,
    },
    eventModalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        maxHeight: '80%',
    },
    eventInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    eventDescriptionInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    dateTimeButton: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    friendSelectorButton: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    eventModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    eventModalButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    cancelEventButton: {
        backgroundColor: '#aaa',
    },
    eventModalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    friendSelectorList: {
        width: '100%',
        maxHeight: 300,
        marginBottom: 10,
    },
    friendSelectorItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedFriendItem: {
        backgroundColor: '#e6f3ff',
    },
    friendSelectorName: {
        fontSize: 16,
    },
});
