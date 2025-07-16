import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScoreDAO } from '../interfaces/ScoreDAO';

export class ScoreAsyncStorageDAO implements ScoreDAO {

    async loadScore(): Promise<number> {
        const json = await AsyncStorage.getItem('score');
        return json !== null ? Number(json) : 0;
    }

    async saveScore(score: number): Promise<void> {
        try {
            await AsyncStorage.setItem('score', JSON.stringify(score));
        } catch (e) {
            console.error("Could not save score");
        }
    }

}