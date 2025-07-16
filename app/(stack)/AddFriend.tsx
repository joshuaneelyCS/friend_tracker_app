import service from '@/server/main/service/FriendListService';
import Friend from '@/shared/classes/Friend';
import Name from '@/shared/classes/Name';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddFriend() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSave = async () => {
        if (!firstName || !lastName) {
            setError('Please enter both first and last name');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const name = new Name(firstName, lastName);
            const friend = new Friend(name);
            await service.addFriend(friend);
            router.back();
        } catch (e) {
            setError(`Failed to save friend: ${e}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={router.back} disabled={isLoading}>
                <Text style={[styles.backButton, isLoading && styles.disabled]}>Back</Text>
            </TouchableOpacity>
            <View style={styles.content}>
                {error && <Text style={styles.error}>{error}</Text>}
                <TextInput
                    placeholder="First name"
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    editable={!isLoading}
                />
                <TextInput
                    placeholder="Last name"
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    editable={!isLoading}
                />
                <Button
                    title={isLoading ? "Saving..." : "Save Friend"}
                    onPress={handleSave}
                    disabled={isLoading}
                />
                {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  disabled: {
      opacity: 0.5,
  },
});
