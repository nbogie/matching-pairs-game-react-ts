import React, { useEffect, useReducer, useState } from 'react';
import { Leaderboard, LeaderboardEntry, LeaderboardView } from './Leaderboard';
import { Card, CardView } from './Card';
import { makeEmojisDeck } from './Deck';

type Action =
    | { type: 'reset' }
    | { type: 'flipCard', card: Card }
    | { type: 'clickAcknowledge' }

//differentiated union type
/** Whether a card has been turned, or two, or none yet.*/
type TurnStatus =
    | { title: 'noneTurned' }
    | { title: 'oneTurned'; firstCard: Card }
    | { title: 'twoTurned'; firstCard: Card; secondCard: Card };

interface GameState {
    clickCount: number;
    turnStatus: TurnStatus;
    timeOfGameStart: number | null;
    deck: Card[],
    leaderboard: Leaderboard
}

export default function PairsGame() {

    const [timeSinceFirstLoad, setTimeSinceFirstLoad] = useState(0);


    function cardsRemain() {
        return gameState.deck.filter(c => !c.isRemoved).length > 0;
    }
    function createNewLeaderboard(prevBoard: Leaderboard, entry: LeaderboardEntry): Leaderboard {
        const newBoard = [...prevBoard, entry];
        newBoard.sort((e1, e2) => e1.elapsedTime - e2.elapsedTime)
        return newBoard;
    }

    function reducerFn(gameState: GameState, action: Action): GameState {
        debugger;
        function handleClickWhenTwoCardsFaceUp(gs: GameState): GameState {
            if (gs.turnStatus.title !== 'twoTurned') {
                return gameState;
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
            if (!cardsRemain()) {
                return resetGame(processScore(gs));
            }
            else {
                return { ...gs, turnStatus: { title: 'noneTurned' } }
            }
        }

        function resetGame(gs: GameState): GameState {
            return {
                ...gs, clickCount: 0, turnStatus: { title: 'noneTurned' }, timeOfGameStart: timeSinceFirstLoad
            }
        }

        function processScore(gs: GameState): GameState {
            const entry: LeaderboardEntry = {
                elapsedTime: timeSinceFirstLoad - (gs.timeOfGameStart || 0),
                clickCount: gs.clickCount,
                at: new Date()
            };
            return { ...gs, leaderboard: createNewLeaderboard(gs.leaderboard, entry) }
        }

        const stateTitle = gameState.turnStatus.title;

        switch (action.type) {

            case 'reset': {
                return resetGame(gameState);
            }
            case 'clickAcknowledge': {
                return handleClickWhenTwoCardsFaceUp(gameState);
            }
            case 'flipCard': {
                debugger;
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
                    return {
                        ...gameState,
                        turnStatus: { title: 'oneTurned', firstCard: action.card },
                        clickCount: gameState.clickCount + 1
                    }
                }
                if (stateTitle === 'oneTurned') {
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
    const initialState: GameState = {
        clickCount: 0,
        turnStatus: {
            title: 'noneTurned'
        },
        timeOfGameStart: null,
        deck: makeEmojisDeck(),
        leaderboard: []
    }
    const [gameState, dispatch] = useReducer(reducerFn, initialState);


    //increase timeSinceFirstLoad
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSinceFirstLoad(et => et + 1);
        }, 1000)
        return () => clearInterval(interval);
    }, []);


    function handleClickOnMat() {
        if (gameState.turnStatus.title === 'twoTurned') {
            dispatch({ type: 'clickAcknowledge' })
        }
    }
    function handleClickCard(c: Card) {
        if (gameState.turnStatus.title === 'twoTurned') {
            dispatch({ type: 'clickAcknowledge' })
        } else {
            dispatch({ type: 'flipCard', card: c })
        }
    }

    return (
        <div className="mat" onClick={handleClickOnMat}> <div className="cardset">
            {gameState.deck.map((c, ix) => (
                <CardView card={c} key={ix} handleClickCard={handleClickCard} />
            ))}
        </div>
            <div>TurnStatus: {gameState.turnStatus.title}</div>
            <div>Click count: {gameState.clickCount}</div>
            {gameState.timeOfGameStart && <div>Elapsed Time: {timeSinceFirstLoad - gameState.timeOfGameStart}</div>}
            <LeaderboardView leaderboard={gameState.leaderboard} />
        </div>
    );
}
