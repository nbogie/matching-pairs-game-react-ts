import { makeEmojisDeck } from "../components/Deck";
import { GameState } from "../gameCore/gameState";



export function handleResetGame(gs: GameState): GameState {
    return {
        ...gs,
        deck: makeEmojisDeck(),
        clickCount: 0,
        turnStatus: { title: 'noneTurned' }
    };
}
