import { useReducer } from "react";
import { Card } from "../gameCore/card";
import { createInitialGameState } from "../gameCore/createInitialGameState";
import { reducerFn } from "../reducer/reducer";
import { CardView } from "./CardView";

export default function PairsGame() {
    const [gameState, dispatch] = useReducer(
        reducerFn,
        createInitialGameState()
    );
    function handleClickOnMat() {
        if (gameState.turnStatus.title === "twoTurned") {
            dispatch({ type: "clickAcknowledge" });
        }
    }

    function handleClickCard(c: Card) {
        if (gameState.turnStatus.title === "twoTurned") {
            dispatch({ type: "clickAcknowledge" });
        } else {
            dispatch({ type: "flipCard", card: c });
        }
    }

    return (
        <div className="mat" onClick={handleClickOnMat}>
            <div className="cardset">
                {gameState.deck.map((c: Card, ix: number) => (
                    <CardView
                        card={c}
                        key={ix}
                        handleClickCard={handleClickCard}
                    />
                ))}
            </div>
            <div>TurnStatus: {gameState.turnStatus.title}</div>
            <div>Click count: {gameState.clickCount}</div>
        </div>
    );
}
