import service from '@/server/main/service/FriendListService';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function ContactListItem({date, friendId, refresh}:{date: Date, friendId: string, refresh:()=>{}}) {

    const [initialized, setInitialized] = useState<boolean>();

    useEffect(() => {
        const loadService = async () => {
            setInitialized(true);
        }   
        loadService();
    }, [])

    if (!initialized) {
        return
    }

    const deleteContact = async () => {
        await service.removeContact(friendId, date);
        refresh();
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text>{service.formatDate(date)}</Text>
                <TouchableOpacity onPress={ deleteContact }>
                    <Ionicons name="close-outline" size={32} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})