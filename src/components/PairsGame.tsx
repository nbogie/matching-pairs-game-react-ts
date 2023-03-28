import { useMemo, useReducer } from 'react';
import { createInitialGameState, GameState } from '../core/gameState';
import { reducerFn } from '../reducer/reducer';
import { CardsView } from './CardsView';

export default function PairsGame() {

    const initialState: GameState = useMemo(() => {
        return createInitialGameState()
    }, []);

    const [gameState, dispatch] = useReducer(reducerFn, initialState);

    function handleClickOnMat() {
        if (gameState.turnStatus.title === 'twoTurned') {
            dispatch({ type: 'clickAcknowledge' })
        }
    }

    return (
        <div className="mat" onClick={handleClickOnMat}>
            <CardsView gameState={gameState} dispatch={dispatch} />
            <div>TurnStatus: {gameState.turnStatus.title}</div>
            <div>Click count: {gameState.clickCount}</div>
        </div>
    );
}

