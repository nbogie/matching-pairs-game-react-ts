import { Card } from "./card";
import { makeEmojisDeck } from "./deck";

//differentiated union type
/** Whether a card has been turned, or two, or none yet.*/


export type TurnStatus =
    | { title: 'noneTurned'; }
    | { title: 'oneTurned'; firstCard: Card; }
    | { title: 'twoTurned'; firstCard: Card; secondCard: Card; };

export interface GameState {
    clickCount: number;
    turnStatus: TurnStatus;
    deck: Card[];
}


export function createInitialGameState(): GameState {
    return {
        clickCount: 0,
        turnStatus: {
            title: 'noneTurned'
        },
        deck: makeEmojisDeck(),
    }
}