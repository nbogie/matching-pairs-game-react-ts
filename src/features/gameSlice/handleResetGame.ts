import { makeEmojisDeck } from "../../core/makeEmojisDeck";
import { GameState } from "../gameSlice";

export function handleResetGame(gs: GameState): void {
    gs.deck = makeEmojisDeck();
    gs.clickCount = 0;
    gs.turnStatus = { title: "noneTurned" };
}
