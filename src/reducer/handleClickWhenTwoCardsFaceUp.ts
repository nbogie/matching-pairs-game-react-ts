import { Card } from "../gameCore/card";
import { GameState } from "../gameCore/gameState";
import { replaceCard } from "./reducer";
import { handleResetGame } from "./handleResetGame";

export function handleClickWhenTwoCardsFaceUp(gs: GameState): GameState {
    if (gs.turnStatus.title !== 'twoTurned') {
        return gs;
    }

    const { firstCard: a, secondCard: b } = gs.turnStatus;
    let nextDeck = gs.deck;
    if (a.emoji === b.emoji) {
        nextDeck = replaceCard(nextDeck, a.id, (c) => ({ ...c, isRemoved: true }));
        nextDeck = replaceCard(nextDeck, b.id, (c) => ({ ...c, isRemoved: true }));
    }

    //in either case, unflip.
    nextDeck = replaceCard(nextDeck, a.id, (c) => ({ ...c, isFaceUp: false }));
    nextDeck = replaceCard(nextDeck, b.id, (c) => ({ ...c, isFaceUp: false }));

    if (!cardsRemain(nextDeck)) {
        return handleResetGame(gs);
    }
    else {
        return { ...gs, deck: nextDeck, turnStatus: { title: 'noneTurned' } };
    }
}


function cardsRemain(deck: Card[]): boolean {
    return deck.filter((c: Card) => !c.isRemoved).length > 0;
}