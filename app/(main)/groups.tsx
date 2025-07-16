import GroupListService from '@/server/main/service/GroupListService';
import { Ionicons } from '@expo/vector-icons'; // For plus icon; install if needed
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Groups() {
    const [groups, setGroups] = useState(GroupListService.getGroupList());
    const router = useRouter();

    useEffect(() => {
        // Refresh groups from service on mount
        const loadGroups = async () => {
            await GroupListService.refreshService();
            setGroups(GroupListService.getGroupList());
        };
        loadGroups();
    }, []);

    // When the addGroup button is pressed
    const handleAddGroup = () => {
        Alert.prompt(
            'Create New Group',
            'Enter the group name:',
            async (name) => {
                if (name) {
                    await GroupListService.addGroup(name);
                    setGroups(GroupListService.getGroupList()); // Refresh UI
                }
            }
        );
    };

    const handleGroupPress = (groupName: string) => {
        router.push({
            pathname: '/GroupDetail',
            params: { groupName: groupName }
          })
    };

    // Function to render the group item
    const renderGroupItem = ({ item }: { item: { name: string; isAddButton?: boolean; isSpacer?: boolean } }) => {
        if (item.isAddButton) {
            return (
                <TouchableOpacity style={styles.addCard} onPress={handleAddGroup}>
                    <Ionicons name="add-circle" size={40} color="#007AFF" />
                    <Text style={styles.addText}>Add Group</Text>
                </TouchableOpacity>
            );
        } else if (item.isSpacer) {
            return (
                <View style={[styles.card, { shadowColor: 'transparent', backgroundColor: 'transparent',}]} />
            );
        }
        return (
            <TouchableOpacity style={styles.card} onPress={() => handleGroupPress(item.name)}>
                <Text style={styles.cardText}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    // Prepare data: Groups + Add button
    const data = groups.length > 0 
    ? [...groups, { name: '', isAddButton: true }, {name: '', isSpacer: true}] 
    : [{ name: '', isAddButton: true }, {name: '', isSpacer: true}];

    return (
        <View style={{ paddingBottom: 80, flex: 1 }}>
            <View style={styles.topBar}>
                <View style={styles.header}>
                {/* TITLE */}
                <Text style={styles.titleText}>myGroups</Text>

                {/* BUTTONS */}
                <View style={styles.buttons}>

                    {/* FILTERS BUTTON */}
                    <TouchableOpacity onPress={()=>{}}>
                    <Ionicons name="filter-circle-outline" size={32} color="black" />
                    </TouchableOpacity>

                    {/* PLUS BUTTON */}
                    <TouchableOpacity onPress={()=>{}}>
                        <Ionicons name="add" size={32} color="black" />
                    </TouchableOpacity>
                </View>
                </View>

                {/* SEARCH BAR */}
                <TextInput
                placeholder="Search for a friend..."
                value={""}
                onChangeText={(text) => {}}
                style={styles.searchBar}
                />
            </View>
            <View style={styles.container}>
                <FlatList
                    data={data}
                    renderItem={renderGroupItem}
                    keyExtractor={(item, index) => item.name || `add-${index}`}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
    list: { justifyContent: 'center' },
    card: {
        flex: 1,
        margin: 8,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    addCard: {
        flex: 1,
        margin: 8,
        padding: 16,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    cardText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    addText: { marginTop: 8, fontSize: 14, color: '#007AFF' },
    topBar: {
        backgroundColor: '#f7d702',
        paddingTop: 60,
        paddingHorizontal: 16,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      buttons: {
        flexDirection: 'row',
      },
      titleText: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      searchBar: {
        height: 40,
        borderColor: 'gray',
        backgroundColor: 'white',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
        borderRadius: 16,
      }
});
// ... existing code ... (end of file)