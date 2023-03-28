import { Card } from "../../core/card";
import { GameState } from "../gameSlice";
import { handleResetGame } from "./handleResetGame";

export function handleClickWhenTwoCardsFaceUp(draftGameState: GameState): void {
    if (draftGameState.turnStatus.title !== "twoTurned") {
        return;
    }

    const { firstCard: a, secondCard: b } = draftGameState.turnStatus;
    //we want to manipulate the cards in the deck, not the cards in the turnStatus
    const pickedCardsInDeck = draftGameState.deck.filter((c) =>
        [a.id, b.id].includes(c.id)
    );

    if (a.emoji === b.emoji) {
        pickedCardsInDeck.forEach((c) => (c.state = "removed"));
    } else {
        pickedCardsInDeck.forEach((c) => (c.state = "faceDown"));
    }
    if (!cardsRemain(draftGameState.deck)) {
        handleResetGame(draftGameState);
        return;
    }

    draftGameState.turnStatus = { title: "noneTurned" };
}

function cardsRemain(deck: Card[]): boolean {
    return deck.filter((c: Card) => c.state !== "removed").length > 0;
}
