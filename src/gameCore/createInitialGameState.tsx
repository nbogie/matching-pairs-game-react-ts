import { GameState } from "./gameState";
import { makeEmojisDeck } from "./makeEmojisDeck";

export function createInitialGameState(): GameState {
    return {
        clickCount: 0,
        turnStatus: {
            title: "noneTurned",
        },
        deck: makeEmojisDeck(),
    };
}
