import { makeEmojisDeck } from "./makeEmojisDeck";

test("makeEmojisDeck has right len", () => {
    expect(makeEmojisDeck()).toHaveLength(16);
});

test("makeEmojisDeck", () => {
    const deck = makeEmojisDeck();
    const emojisUsed = deck.map((c) => c.emoji).sort();
    expect(emojisUsed[0]).toEqual(emojisUsed[1]);
    expect(emojisUsed[2]).toEqual(emojisUsed[3]);
});

test("face down all at start", () => {
    expect(makeEmojisDeck().every((c) => c.status === "face-down")).toBe(true);
});
