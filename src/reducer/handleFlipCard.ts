import { GameState } from "../gameState";
import { Draft } from "immer";
import { FlipCardAction } from "./reducer";

export function handleFlipCard(draftGameState: Draft<GameState>, action: FlipCardAction) {
    const stateTitle = draftGameState.turnStatus.title;

    if (stateTitle === 'twoTurned') {
        //should never be called
        return;
    }

    if (action.card.isRemoved) {
        console.error('Clicked card which has been removed!');
        return;
    }

    if (action.card.isFaceUp) {
        return;
    }

    if (draftGameState.turnStatus.title === 'noneTurned') {
        //Don't mutate the card - this will cause the reducer not to be pure, and second time through processing 
        //(in strict mode) the action card will be face up, causing issues
        const card = draftGameState.deck.find(c => c.id === action.card.id)!;
        card.isFaceUp = true;
        draftGameState.turnStatus = { title: 'oneTurned', firstCard: action.card };
        draftGameState.clickCount++;
        return;
    }

    if (draftGameState.turnStatus.title === 'oneTurned') {
        const card = draftGameState.deck.find(c => c.id === action.card.id)!;
        card.isFaceUp = true;
        draftGameState.turnStatus = {
            title: 'twoTurned',
            firstCard: draftGameState.turnStatus.firstCard,
            secondCard: action.card
        };
        draftGameState.clickCount++;
        return;
    }

    //TODO: remove this.  convince typechecker path is not reachable.
    throw new Error('should never reach this point');

}