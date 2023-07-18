import { GameState } from "../gameCore/gameState";
import { Action } from "./actions";
import { handleFlipCard } from "./handleFlipCard";
import { handleClickWhenTwoCardsFaceUp } from "./handleClickWhenTwoCardsFaceUp";
import { handleResetGame } from "./handleResetGame";

export function reducerFn(gameState: GameState, action: Action): GameState {
    switch (action.type) {
        case "reset": {
            return handleResetGame(gameState);
        }

        case "clickAcknowledge": {
            return handleClickWhenTwoCardsFaceUp(gameState);
        }

        case "flipCard": {
            return handleFlipCard(gameState, action);
        }
        default:
            throw new Error("should never reach this point");
    }
}
