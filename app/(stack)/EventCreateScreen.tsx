// app/(stack)/CreateEventScreen.tsx
import eventService from '@/server/main/service/EventService';
import service from '@/server/main/service/FriendListService';
import Event from '@/shared/classes/Event';
import Friend from '@/shared/classes/Friend';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

export default function CreateEventScreen() {
    const router = useRouter();
    const { friendId } = useLocalSearchParams();

    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventTime, setEventTime] = useState('');
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [allFriends, setAllFriends] = useState<Friend[]>([]);

    useEffect(() => {
        const loadFriends = async () => {
            await service.refreshService();
            setAllFriends(service.getSortedFriendList());
        };

    loadFriends();
}, []);

    useEffect(() => {
        if (friendId && typeof friendId === 'string') {
            setSelectedFriends([friendId]);
        }
    }, [friendId]);

    const openDatePicker = () => {
        setShowDatePicker(true);
    };

    const onDateSelect = (event: any, date?: Date) => {
        if (date) {
            setEventDate(date);
            
        }
        setShowDatePicker(false)
    }

    const handleCreateEvent = async () => {
        if (!eventName.trim()) {
            Alert.alert('Please enter an event name');
            return;
        }

        const newEvent = new Event(eventName, eventDescription, eventDate, eventTime, selectedFriends);
        await eventService.addEvent(newEvent);
        router.back();
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.modalTitle}>Create Event</Text>

            <TextInput
                style={styles.eventInput}
                placeholder="Event Name"
                value={eventName}
                onChangeText={setEventName}
            />
            <TextInput
                style={[styles.eventInput, styles.eventDescriptionInput]}
                placeholder="Description (optional)"
                value={eventDescription}
                onChangeText={setEventDescription}
                multiline
                numberOfLines={3}
            />
            <TouchableOpacity style={styles.dateTimeButton} onPress={openDatePicker}>
                <Text>Date: {eventDate.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && <DateTimePicker
                value={eventDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onDateSelect}
            />}
           
            <TextInput
                style={styles.eventInput}
                placeholder="Time (optional)"
                value={eventTime}
                onChangeText={setEventTime}
            />

            <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 20 }}>Add Friends</Text>
            {allFriends.map(friend => (
                <TouchableOpacity
                    key={friend.id}
                    style={{
                        padding: 10,
                        marginVertical: 4,
                        borderRadius: 8,
                        backgroundColor: selectedFriends.includes(friend.id) ? '#cce5ff' : '#f0f0f0',
                    }}
                    onPress={() => {
                        setSelectedFriends(prev =>
                            prev.includes(friend.id)
                                ? prev.filter(id => id !== friend.id)
                                : [...prev, friend.id]
                        );
                    }}
                >
                    <Text>{friend.name.firstName} {friend.name.lastName}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.eventModalButton} onPress={handleCreateEvent}>
                <Text style={styles.eventModalButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.eventModalButton, styles.cancelEventButton]} onPress={() => router.back()}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        backgroundColor: 'white',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    eventInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: '#fff',
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
    eventModalButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        marginVertical: 8,
    },
    cancelEventButton: {
        backgroundColor: '#aaa',
    },
    eventModalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
