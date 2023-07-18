import { Card } from "./components/Card";
import allAvailableEmojis, { Emoji } from "./emojis";

export function makeEmojisDeck(): Card[] {
    //take 8 emojis.  We'll instantiate double to make the deck.
    const emojisToUse = shuffle([...allAvailableEmojis]).slice(0, 8);

    function makeEmojiCard(e: Emoji, id: number): Card {
        return { emoji: e, id, isFaceUp: false, isRemoved: false };
    }

    return shuffle(
        emojisToUse.flatMap((e, ix) => [
            makeEmojiCard(e, 2 * ix),
            makeEmojiCard(e, 2 * ix + 1),
        ])
    );
}

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => (Math.random() < 0.5 ? -1 : 1));
}
