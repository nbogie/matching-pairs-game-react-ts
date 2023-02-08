import { makeEmojisDeck } from "../components/Deck";
import { GameState } from "../gameState";
import { Draft } from "immer";



export function handleResetGame(gs: Draft<GameState>): void {
    gs.deck = makeEmojisDeck();
    gs.clickCount = 0;
    gs.turnStatus = { title: 'noneTurned' };
}
