import { makeEmojisDeck } from "../core/deck";
import { GameState } from "../core/gameState";
import { Draft } from "immer";



export function handleResetGame(gs: Draft<GameState>): void {
    gs.deck = makeEmojisDeck();
    gs.clickCount = 0;
    gs.turnStatus = { title: 'noneTurned' };
}
