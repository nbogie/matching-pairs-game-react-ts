export type CardState = "faceUp" | "faceDown" | "removed"
export interface Card {
    emoji: string;
    id: number;
    state: CardState;
}
