import { Card } from "./card";

export type TurnStatus =
    | { title: 'noneTurned'; }
    | { title: 'oneTurned'; firstCard: Card; }
    | { title: 'twoTurned'; firstCard: Card; secondCard: Card; };

export interface GameState {
    clickCount: number;
    turnStatus: TurnStatus;
    deck: Card[];
}
