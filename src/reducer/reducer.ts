import { Card } from "../core/card";
import { GameState } from "../core/gameState";
import produce from "immer";
import { handleFlipCard } from "./handleFlipCard";
import { handleClickWhenTwoCardsFaceUp } from "./handleClickWhenTwoCardsFaceUp";
import { handleResetGame } from "./handleResetGame";

export function reducerFn(gameState: GameState, action: Action): GameState {
    //use immer's produce() function to allow us to manipulate a draftGameState and magically get a
    //corresponding newly-built gameState object back with the appropriate changes.
    return produce(gameState, (draftGameState) => {
        switch (action.type) {
            case "reset": {
                handleResetGame(draftGameState);
                return;
            }

            case "clickAcknowledge": {
                handleClickWhenTwoCardsFaceUp(draftGameState);
                return;
            }

            case "flipCard":
                handleFlipCard(draftGameState, action);
                return;

            default:
                throw new UnreachableCodeError(
                    action,
                    `unexpected action: ${JSON.stringify(action)}`
                );
        }
    });
}

class UnreachableCodeError extends Error {
    constructor(myNever: never, message: string) {
        super(message);
    }
}

export type FlipCardAction = { type: "flipCard"; card: Card };
type AcknowledgeAction = { type: "clickAcknowledge" };
type ResetAction = { type: "reset" };

export type Action = ResetAction | FlipCardAction | AcknowledgeAction;
