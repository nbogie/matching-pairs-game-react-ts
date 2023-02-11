import { Card } from "../core/card";
import emojis, { Emoji } from '../core/emojis';

export function makeEmojisDeck(): Card[] {
    const emojisToUse = [...emojis]
        .sort((a, b) => Math.random() - 0.5) //shuffle
        .slice(0, 8); //take 8 emojis.  We'll instantiate double to make the deck.

    function makeEmojiCard(e: Emoji, id: number): Card {
        return { emoji: e, id, state: "faceDown" };
    }

    return shuffle(
        emojisToUse.flatMap((e, ix) => [
            makeEmojiCard(e, 2 * ix),
            makeEmojiCard(e, 2 * ix + 1)
        ])
    );
}


function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort((a, b) => Math.random() - 0.5);
}

