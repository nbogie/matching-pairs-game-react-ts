import { Card } from "../card";

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
            className={
                'card ' +
                (card.isFaceUp ? 'face-up' : '') +
                ' ' +
                (card.isRemoved ? 'removed' : '')
            }
        >
            {!card.isRemoved && card.isFaceUp && card.emoji}
        </div>
    );
}
