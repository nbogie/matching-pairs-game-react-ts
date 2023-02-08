import { Card } from "../gameCore/card";
import { GameState } from "../gameCore/gameState";
import { Action } from "./actions";
import { handleFlipCard } from "./handleFlipCard";
import { handleClickWhenTwoCardsFaceUp } from "./handleClickWhenTwoCardsFaceUp";
import { handleResetGame } from "./handleResetGame";

export function reducerFn(gameState: GameState, action: Action): GameState {

    switch (action.type) {

        case 'reset': {
            return handleResetGame(gameState);
        }

        case 'clickAcknowledge': {
            return handleClickWhenTwoCardsFaceUp(gameState);
        }

        case 'flipCard': {
            return handleFlipCard(gameState, action);
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


