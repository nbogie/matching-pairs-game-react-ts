import { Card } from "./card";
import { makeEmojisDeck } from "./components/Deck";
import { GameState } from "./gameState";
import produce, { Draft } from "immer"

export function reducerFn(gameState: GameState, action: Action): GameState {

    //use immer's produce() function to allow us to manipulate a draftGameState and magically get a 
    //corresponding newly-built gameState object back with the appropriate changes.

    return produce(gameState, draftGameState => {

        switch (action.type) {

            case 'reset': {
                resetGame(draftGameState);
                return;
            }

            case 'clickAcknowledge': {
                handleClickWhenTwoCardsFaceUp(draftGameState);
                return;
            }

            case 'flipCard':
                handleFlipCard(draftGameState, action);
                return;

            default:
                throw new Error('should never reach this point')
        }
    })
}
function handleFlipCard(draftGameState: Draft<GameState>, action: FlipCardAction) {
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
        const card = draftGameState.deck.find(c => c.id === action.card.id)!
        card.isFaceUp = true;
        draftGameState.turnStatus = { title: 'oneTurned', firstCard: action.card };
        draftGameState.clickCount++
        return;
    }

    if (draftGameState.turnStatus.title === 'oneTurned') {
        const card = draftGameState.deck.find(c => c.id === action.card.id)!
        card.isFaceUp = true;
        draftGameState.turnStatus = {
            title: 'twoTurned',
            firstCard: draftGameState.turnStatus.firstCard,
            secondCard: action.card
        };
        draftGameState.clickCount++;
        return
    }

    //TODO: remove this.  convince typechecker path is not reachable.
    throw new Error('should never reach this point')

}


function handleClickWhenTwoCardsFaceUp(draftGameState: Draft<GameState>): void {

    if (draftGameState.turnStatus.title !== 'twoTurned') {
        return;
    }

    const { firstCard: a, secondCard: b } = draftGameState.turnStatus;
    //we want to manipulate the cards in the deck, not the cards in the turnStatus
    const pickedCardsInDeck = draftGameState.deck.filter(c => [a.id, b.id].includes(c.id));

    if (a.emoji === b.emoji) {
        pickedCardsInDeck.forEach(c => c.isRemoved = true)
    }

    //in either case, unflip.
    pickedCardsInDeck.forEach(c => c.isFaceUp = false)

    if (!cardsRemain(draftGameState.deck)) {
        resetGame(draftGameState);
        return;
    }
    else {
        draftGameState.turnStatus = { title: 'noneTurned' };
        return;
    }
}

function cardsRemain(deck: Card[]): boolean {
    return deck.filter((c: Card) => !c.isRemoved).length > 0;
}


function resetGame(gs: Draft<GameState>): void {
    gs.deck = makeEmojisDeck();
    gs.clickCount = 0;
    gs.turnStatus = { title: 'noneTurned' }
}

type FlipCardAction = { type: 'flipCard'; card: Card; }
type AcknowledgeAction = { type: 'clickAcknowledge'; }
type ResetAction = { type: 'reset' }

export type Action =
    | ResetAction
    | FlipCardAction
    | AcknowledgeAction;
