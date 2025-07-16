export interface ScoreDAO {
    loadScore(): Promise<number>;
    saveScore(score: number): Promise<void>;
}