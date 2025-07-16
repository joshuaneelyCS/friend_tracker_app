import Friend from '@/shared/classes/Friend';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FriendListItem } from './FriendListItem';

export function FriendList ({ list, refresh, filterKey }:{ list: Friend[], refresh: () => void, filterKey: string}){

  const shownDates = new Set<string>();

  const determineTitle = (friend: Friend): string => {
    if (filterKey === 'lastContactFirst' || filterKey === 'recentContactFirst') {
      return groupByDate(friend);
    } else if (filterKey === 'leastContactedFirst' || filterKey === 'mostContactedFirst') {
      return groupByContacts(friend);
    }
    return '';
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const groupByDate = (friend: Friend): string => {

    // See if there are people without any contacts
    if (friend.contacts.length === 0) {
      if (!shownDates.has('Not Contacted')) {
        shownDates.add('Not Contacted');
        return 'Not Contacted';
      }
      return '';
    }
    
    // Check to see if the last contact is not null of the friend
    const last = friend.contacts[friend.contacts.length - 1];
    if (!last) return '';

    // Create new date object and make sure it is not null
    const contactDate = new Date(last);
    if (isNaN(contactDate.getTime())) return '';

    // Ensures uniqueness per day
    const dateStr = contactDate.toDateString(); 

    if (!shownDates.has(dateStr)) {
      shownDates.add(dateStr);

      var today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (dateStr === (today.toDateString())) {
        return "Today"
      } else if (dateStr === (yesterday.toDateString())) {
        return 'Yesterday';
      }
      return formatDate(contactDate);
    }
    return '';
  };

  const groupByContacts = (friend: Friend): string => {
    
    // See if there are people without any contacts
    if (friend.contacts.length === 0) {
      if (!shownDates.has('Not Contacted')) {
        shownDates.add('Not Contacted');
        return 'Not Contacted';
      }
      return '';
    }

    // Create new contact object
    const numContacts = friend.contacts.length.toString();
    
    if (!shownDates.has(numContacts)) {
      shownDates.add(numContacts);
      const s = numContacts === '1' ? '' : 's';
      return `${numContacts} Contact${s}`
    }
    return '';

  }

  return (
    <ScrollView style={styles.list}>
      {list.map((friend, index) => {
        const text = determineTitle(friend);
        return (
          <View key={friend.id ?? index}>
            {text !== '' && <Text style={styles.header}>{text}</Text>}
            <FriendListItem
              friend={friend}
              friendIndex={index}
              refresh={refresh}
            />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 10,
  },
  list: {
    padding: 16
  }
});