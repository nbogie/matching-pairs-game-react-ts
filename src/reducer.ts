import { Card } from "./card";
import { GameState } from "./gameState";

export function reducerFn(gameState: GameState, action: Action): GameState {


    const stateTitle = gameState.turnStatus.title;
    console.log({ gameState })

    switch (action.type) {

        case 'reset': {
            return resetGame(gameState);
        }

        case 'clickAcknowledge': {
            return handleClickWhenTwoCardsFaceUp(gameState);
        }

        case 'flipCard': {
            debugger
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

            //todo: don't mutate
            action.card.isFaceUp = true;

            if (stateTitle === 'noneTurned') {
                console.log("in NONE turned")
                return {
                    ...gameState,
                    turnStatus: { title: 'oneTurned', firstCard: action.card },
                    clickCount: gameState.clickCount + 1
                }
            }

            if (stateTitle === 'oneTurned') {
                console.log("in one turned")

                return {
                    ...gameState,
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
    if (a.emoji === b.emoji) {
        //TODO: don't mutate card states
        a.isRemoved = true;
        b.isRemoved = true;
    }
    //in either case, unflip.
    a.isFaceUp = false;
    b.isFaceUp = false;
    if (!cardsRemain(gs)) {
        return resetGame(gs);
    }
    else {
        return { ...gs, turnStatus: { title: 'noneTurned' } }
    }
}
function cardsRemain(gs: GameState): boolean {
    return gs.deck.filter((c: Card) => !c.isRemoved).length > 0;
}


function resetGame(gs: GameState): GameState {
    return {
        ...gs,
        clickCount: 0,
        turnStatus: { title: 'noneTurned' }
    }
}

export type Action = { type: 'reset'; } |
{ type: 'flipCard'; card: Card; } |
{ type: 'clickAcknowledge'; };
//differentiated union type
/** Whether a card has been turned, or two, or none yet.*/
