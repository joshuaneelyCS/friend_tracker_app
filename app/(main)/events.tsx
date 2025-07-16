// app/(main)/events.tsx
import eventService from '@/server/main/service/EventService';
import service from '@/server/main/service/FriendListService';
import Event from '@/shared/classes/Event';
import Friend from '@/shared/classes/Friend';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function EventsScreen() {
    const [events, setEvents] = useState<Event[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);

    const loadData = async () => {
        await eventService.refreshService();
        await service.refreshService();
        
        const allEvents = eventService.getSortedEventList();
        const allFriends = service.getSortedFriendList();
        
        setEvents(allEvents);
        setFriends(allFriends);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const getFriendNames = (friendIds: string[]): string => {
        const friendNames = friendIds
            .map(id => {
                const friend = friends.find(f => f.id === id);
                return friend ? `${friend.name.firstName} ${friend.name.lastName}` : 'Unknown';
            })
            .join(', ');
        return friendNames;
    };

    const formatEventDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const isEventUpcoming = (date: Date): boolean => {
        return date.getTime() >= new Date().setHours(0, 0, 0, 0);
    };

    const renderEventItem = ({ item }: { item: Event }) => {
        const isUpcoming = isEventUpcoming(item.date);
        
        return (
            <View style={[styles.eventItem, !isUpcoming && styles.pastEventItem]}>
                <View style={styles.eventHeader}>
                    <Text style={[styles.eventName, !isUpcoming && styles.pastEventText]}>
                        {item.name}
                    </Text>
                    <View style={styles.eventDateContainer}>
                        <Text style={[styles.eventDate, !isUpcoming && styles.pastEventText]}>
                            {formatEventDate(item.date)}
                        </Text>
                        {isUpcoming && <Ionicons name="time-outline" size={16} color="#007AFF" />}
                    </View>
                </View>
                
                {item.time && (
                    <Text style={[styles.eventTime, !isUpcoming && styles.pastEventText]}>
                        {item.time}
                    </Text>
                )}
                
                {item.description && (
                    <Text style={[styles.eventDescription, !isUpcoming && styles.pastEventText]}>
                        {item.description}
                    </Text>
                )}
                
                <Text style={[styles.eventParticipants, !isUpcoming && styles.pastEventText]}>
                    With: {getFriendNames(item.friendIds)}
                </Text>
                
                {!isUpcoming && (
                    <View style={styles.pastEventBadge}>
                        <Text style={styles.pastEventBadgeText}>Past</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Events</Text>
            </View>
            
            {events.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="calendar-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No events scheduled</Text>
                    <Text style={styles.emptySubtext}>
                        Create events from your friends' profiles
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={events}
                    renderItem={renderEventItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 20,
    },
    eventItem: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    pastEventItem: {
        backgroundColor: '#f5f5f5',
        borderLeftColor: '#ccc',
        opacity: 0.7,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        color: '#333',
    },
    eventDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    eventDate: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    eventTime: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    eventDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
        lineHeight: 20,
    },
    eventParticipants: {
        fontSize: 13,
        color: '#888',
        fontStyle: 'italic',
    },
    pastEventText: {
        color: '#999',
    },
    pastEventBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#ccc',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    pastEventBadgeText: {
        fontSize: 10,
        color: 'white',
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 20,
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        lineHeight: 22,
    },
});