import { Card } from "../gameCore/card";
import { GameState } from "../gameCore/gameState";
import { replaceCard } from "../gameCore/replaceCard";
import { FlipCardAction } from "./actions";

export function handleFlipCard(
    gameState: GameState,
    action: FlipCardAction
): GameState {
    const stateTitle = gameState.turnStatus.title;

    if (stateTitle === "twoTurned") {
        //should never be called
        return gameState;
    }

    if (action.card.isRemoved) {
        console.error("Clicked card which has been removed!");
        return gameState;
    }

    if (action.card.isFaceUp) {
        return gameState;
    }

    if (stateTitle === "noneTurned") {
        //Don't mutate the card - this will cause the reducer not to be pure, and second time through processing
        //(in strict mode) the action card will be face up, causing issues
        const newDeck = replaceCard(
            gameState.deck,
            action.card.id,
            (c: Card) => ({ ...c, isFaceUp: true })
        );
        return {
            ...gameState,
            deck: newDeck,
            turnStatus: { title: "oneTurned", firstCard: action.card },
            clickCount: gameState.clickCount + 1,
        };
    }

    if (stateTitle === "oneTurned") {
        const newDeck = replaceCard(
            gameState.deck,
            action.card.id,
            (c: Card) => ({ ...c, isFaceUp: true })
        );

        return {
            ...gameState,
            deck: newDeck,
            turnStatus: {
                title: "twoTurned",
                firstCard: gameState.turnStatus.firstCard,
                secondCard: action.card,
            },
            clickCount: gameState.clickCount + 1,
        };
    }

    //TODO: remove this.  convince typechecker path is not reachable.
    throw new Error("should never reach this point");
}
