import { GameState } from "./gameState";
import { makeEmojisDeck } from "../components/Deck";

export function createInitialGameState(): GameState {
    return {
        clickCount: 0,
        turnStatus: {
            title: "noneTurned",
        },
        deck: makeEmojisDeck(),
    };
}
