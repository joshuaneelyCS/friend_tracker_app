import FiltersBottomSheet from '@/components/friendList/FiltersBottomSheet';
import { FriendList } from '@/components/friendList/FriendList';
import service from '@/server/main/service/FriendListService';
import Friend from '@/shared/classes/Friend';
import * as filters from '@/shared/templates/FriendListFilters';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function HomeScreen() {

  // Friends in list (sorted)
  const [friends, setFriends] = useState<Friend[]>([]);

  // Current text in the search box
  const [searchQuery, setSearchQuery] = useState('');

  // The displayed friend list that filters from the friend list to work with search
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);

  // Reference to the bottom Sheet that appears from the bottom
  const filterSheetRef = useRef<BottomSheet>(null);
  
  const [filter, setFilter] = useState<string>('');
  const router = useRouter();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadFriends();
    }
  }, [isFocused]);

  // Loads friends when switched back
  useFocusEffect(
    useCallback(() => {
      loadFriends();
    }, [])
  );
  
  // On Update
  const loadFriends = async (filterKey = 'lastContactFirst') => {
    // Updates the storage of friends from async storage
    await service.refreshService();
    setFilter(filterKey);
    // Gets the filter function and stores it in sorted friends
    const filterFunction = filters[filterKey as keyof typeof filters] ?? filters.lastContactFirst;
    const sortedFriends = service.getSortedFriendList(filterFunction);

    // Replaces the friends with the applied filter
    setFriends(sortedFriends);

    // Resets the search filter to show all and clears the search bar
    setFilteredFriends(sortedFriends);
    setSearchQuery('');
  };

  // When someone inputs a character, it handles filtering out people
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const filtered = friends.filter(friend =>
      friend.name.firstName.toLowerCase().includes(query.toLowerCase()) ||
      friend.name.lastName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFriends(filtered);
  }

  // Opens the filter section
  const openFilterSheet = () => {
    filterSheetRef.current?.expand();
  }

  // Applies the filter once chosen
  const applyFilter = (filterKey: string) => {
    loadFriends(filterKey);
  }

  return (
    <View style={{ paddingBottom: 80, flex: 1 }}>
      <View style={styles.topBar}>
        <View style={styles.header}>
          {/* TITLE */}
          <Text style={styles.titleText}>myFriends</Text>

          {/* BUTTONS */}
          <View style={styles.buttons}>
            {/* FILTERS BUTTON */}
            <TouchableOpacity onPress={openFilterSheet}>
              <Ionicons name="filter-circle-outline" size={32} color="black" />
            </TouchableOpacity>

            {/* PLUS BUTTON */}
            
              <TouchableOpacity onPress={()=>{router.push('/AddFriend')}}>
                <Ionicons name="add" size={32} color="black" />
              </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH BAR */}
        <TextInput
          placeholder="Search for a friend..."
          value={searchQuery}
          onChangeText={(text) => handleSearch(text)}
          style={styles.searchBar}
        />
      </View>

      {/* FRIEND LIST VIEW */}
      <FriendList list={filteredFriends} refresh={loadFriends} filterKey={filter} />
      
      {/* BOTTOM SHEET FILTERS */}
      <FiltersBottomSheet onSelectFilter={applyFilter} sheetRef={filterSheetRef} />
    </View>
  );
}

const styles = StyleSheet.create({
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

