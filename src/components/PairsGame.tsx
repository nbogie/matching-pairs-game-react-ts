import { useMemo, useReducer } from 'react';
import { Card } from "../card";
import { GameState } from '../gameState';
import { reducerFn } from '../reducer/reducer';
import { CardView } from './CardView';
import { makeEmojisDeck } from './Deck';

export default function PairsGame() {

    const initialState: GameState = useMemo(() => {
        return {
            clickCount: 0,
            turnStatus: {
                title: 'noneTurned'
            },
            deck: makeEmojisDeck(),
            leaderboard: []
        }
    }, []);

    const [gameState, dispatch] = useReducer(reducerFn, initialState);
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
        <div className="mat" onClick={handleClickOnMat}>
            <div className="cardset">
                {gameState.deck.map((c: Card, ix: number) => (
                    <CardView card={c} key={ix} handleClickCard={handleClickCard} />
                ))}
            </div>
            <div>TurnStatus: {gameState.turnStatus.title}</div>
            <div>Click count: {gameState.clickCount}</div>
        </div>
    );
}
