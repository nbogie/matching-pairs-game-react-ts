import { createInitialGameState } from "../gameCore/createInitialGameState";
import { GameState } from "../gameCore/gameState";

export function handleResetGame(gs: GameState): GameState {
    return createInitialGameState();
}
