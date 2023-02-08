import { Card } from "../gameCore/card";
import { GameState } from "../gameCore/gameState";
import { flipCard } from "./flipCard";
import { handleClickWhenTwoCardsFaceUp } from "./handleClickWhenTwoCardsFaceUp";
import { resetGame } from "./resetGame";

export function reducerFn(gameState: GameState, action: Action): GameState {

    switch (action.type) {

        case 'reset': {
            return resetGame(gameState);
        }

        case 'clickAcknowledge': {
            return handleClickWhenTwoCardsFaceUp(gameState);
        }

        case 'flipCard': {
            return flipCard(gameState, action);
        }
        default:
            throw new Error('should never reach this point')
    }
}

export function replaceCard(cards: Card[], soughtId: number, replacerFn: (c: Card) => Card) {
    const newArray = [...cards];
    const ix = newArray.findIndex(c => c.id === soughtId);
    newArray[ix] = replacerFn(newArray[ix]);
    return newArray;
}

export type FlipCardAction = { type: 'flipCard'; card: Card; }
export type Action =
    | { type: 'reset'; }
    | FlipCardAction
    | { type: 'clickAcknowledge'; };
