import { Card, CardState } from "../core/card";

export interface CardProps {
    handleClickCard: (c: Card) => void;
    card: Card;
}
export function CardView({ card, handleClickCard }: CardProps) {
    return (
        <div
            onClick={(event) => {
                event.stopPropagation();
                handleClickCard(card);
            }}
            className={'card ' + classForCardState(card.state)}
        >
            {card.state === "faceUp" && card.emoji}
        </div>
    );
}

function classForCardState(cs: CardState): string {
    const lookup: Record<CardState, string> = {
        "faceUp": 'face-up',
        "removed": "removed",
        "faceDown": ""
    };
    return lookup[cs]
}