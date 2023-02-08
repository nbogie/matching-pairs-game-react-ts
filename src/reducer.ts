import { Card } from "./card";
import { makeEmojisDeck } from "./components/Deck";
import { GameState } from "./gameState";

export function reducerFn(gameState: GameState, action: Action): GameState {


    const stateTitle = gameState.turnStatus.title;

    switch (action.type) {

        case 'reset': {
            return resetGame(gameState);
        }

        case 'clickAcknowledge': {
            return handleClickWhenTwoCardsFaceUp(gameState);
        }

        case 'flipCard': {
            if (stateTitle === 'twoTurned') {
                //should never be called
                return gameState;
            }

            if (action.card.isRemoved) {
                console.error('Clicked card which has been removed!');
                return gameState;
            }

            if (action.card.isFaceUp) {
                return gameState;
            }



            if (stateTitle === 'noneTurned') {
                //Don't mutate the card - this will cause the reducer not to be pure, and second time through processing 
                //(in strict mode) the action card will be face up, causing issues
                const newDeck = replaceCard(gameState.deck, action.card.id, (c: Card) => ({ ...c, isFaceUp: true }))
                return {
                    ...gameState,
                    deck: newDeck,
                    turnStatus: { title: 'oneTurned', firstCard: action.card },
                    clickCount: gameState.clickCount + 1
                }
            }

            if (stateTitle === 'oneTurned') {
                const newDeck = replaceCard(gameState.deck, action.card.id, (c: Card) => ({ ...c, isFaceUp: true }))

                return {
                    ...gameState,
                    deck: newDeck,
                    turnStatus: { title: 'twoTurned', firstCard: gameState.turnStatus.firstCard, secondCard: action.card },
                    clickCount: gameState.clickCount + 1
                }
            }

            //TODO: remove this.  convince typechecker path is not reachable.
            throw new Error('should never reach this point')
        }
        default:
            throw new Error('should never reach this point')
    }
}


function handleClickWhenTwoCardsFaceUp(gs: GameState): GameState {
    if (gs.turnStatus.title !== 'twoTurned') {
        return gs;
    }

    const { firstCard: a, secondCard: b } = gs.turnStatus;
    let nextDeck = gs.deck;
    if (a.emoji === b.emoji) {
        nextDeck = replaceCard(nextDeck, a.id, (c) => ({ ...c, isRemoved: true }))
        nextDeck = replaceCard(nextDeck, b.id, (c) => ({ ...c, isRemoved: true }))
    }

    //in either case, unflip.
    nextDeck = replaceCard(nextDeck, a.id, (c) => ({ ...c, isFaceUp: false }))
    nextDeck = replaceCard(nextDeck, b.id, (c) => ({ ...c, isFaceUp: false }))

    if (!cardsRemain(nextDeck)) {
        return resetGame(gs);
    }
    else {
        return { ...gs, deck: nextDeck, turnStatus: { title: 'noneTurned' } }
    }
}
function cardsRemain(deck: Card[]): boolean {
    return deck.filter((c: Card) => !c.isRemoved).length > 0;
}


function resetGame(gs: GameState): GameState {
    return {
        ...gs,
        deck: makeEmojisDeck(),
        clickCount: 0,
        turnStatus: { title: 'noneTurned' }
    }
}

function replaceCard(cards: Card[], soughtId: number, replacerFn: (c: Card) => Card) {
    const newArray = [...cards];
    const ix = newArray.findIndex(c => c.id === soughtId);
    newArray[ix] = replacerFn(newArray[ix]);
    return newArray;
}


export type Action =
    | { type: 'reset'; }
    | { type: 'flipCard'; card: Card; }
    | { type: 'clickAcknowledge'; };
