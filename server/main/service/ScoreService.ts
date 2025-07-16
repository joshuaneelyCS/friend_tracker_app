import { ScoreAsyncStorageDAO } from "../dataaccess/asyncStorage/ScoreAsyncStorageDAO";
import { ScoreDAO } from "../dataaccess/interfaces/ScoreDAO";

class ScoreService {

    score: number;
    storage: ScoreDAO;

    constructor() {
        this.score = 0;
        this.storage = new ScoreAsyncStorageDAO();
    }

    async init() {
        this.score = await this.loadScore();
    }

    async setScore(value: number) {
        this.score = value;
        await this.saveScore(this.score);
    }

    async increaseScoreBy(value: number) {
        this.score += value;
        await this.saveScore(this.score);
    }

    async decreaseScoreBy(value: number) {
        this.score -= value;
        await this.saveScore(this.score);
    }

    async loadScore(): Promise<number> {
        return await this.storage.loadScore();
    }

    async saveScore(score: number) {
        await this.storage.saveScore(score);
    }

}

export default ScoreService