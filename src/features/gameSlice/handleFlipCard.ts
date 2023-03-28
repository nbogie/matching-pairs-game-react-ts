import { Card } from "../../core/card";
import { GameState } from "../gameSlice";

export function handleFlipCard(
    draftGameState: GameState,
    action: { payload: { card: Card }; type: string }
): void {
    const stateTitle = draftGameState.turnStatus.title;

    if (stateTitle === "twoTurned") {
        //should never be called
        return;
    }

    if (action.payload.card.state === "removed") {
        console.error("Clicked card which has been removed!");
        return;
    }

    if (action.payload.card.state === "faceUp") {
        return;
    }

    if (draftGameState.turnStatus.title === "noneTurned") {
        //Don't mutate the card - this will cause the reducer not to be pure, and second time through processing
        //(in strict mode) the action card will be face up, causing issues
        const card = draftGameState.deck.find(
            (c) => c.id === action.payload.card.id
        )!;
        card.state = "faceUp";
        draftGameState.turnStatus = {
            title: "oneTurned",
            firstCard: action.payload.card,
        };
        draftGameState.clickCount++;
        return;
    }

    if (draftGameState.turnStatus.title === "oneTurned") {
        const card = draftGameState.deck.find(
            (c) => c.id === action.payload.card.id
        )!;
        card.state = "faceUp";
        draftGameState.turnStatus = {
            title: "twoTurned",
            firstCard: draftGameState.turnStatus.firstCard,
            secondCard: action.payload.card,
        };
        draftGameState.clickCount++;
        return;
    }

    //TODO: remove this.  convince typechecker path is not reachable.
    throw new Error("should never reach this point");
}
