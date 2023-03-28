import { Dispatch } from 'react';
import { Card } from "../core/card";
import { GameState } from '../core/gameState';
import { Action } from '../reducer/reducer';
import { CardView } from './CardView';

interface CardsViewProps {
    gameState: GameState;
    dispatch: Dispatch<Action>;
}
export function CardsView({ gameState, dispatch }: CardsViewProps) {

    function handleClickCard(c: Card) {
        if (gameState.turnStatus.title === 'twoTurned') {
            dispatch({ type: 'clickAcknowledge' });
        } else {
            dispatch({ type: 'flipCard', card: c });
        }
    }

    return <div className="cardset">
        {gameState.deck.map((c: Card) => (
            <CardView
                card={c}
                handleClickCard={handleClickCard}
                key={c.id}
            />
        ))}
    </div>;
}
