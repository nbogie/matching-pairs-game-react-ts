export interface Card {
    readonly isFaceUp: boolean;
    readonly emoji: string;
    readonly id: number;
    readonly isRemoved: boolean;
}

export interface CardProps {
    handleClickCard: (c: Card) => void;
    card: Card;
}
export function CardView(props: CardProps) {
    return (
        <div
            onClick={(event) => {
                event.stopPropagation();
                props.handleClickCard(props.card);
            }}
            className={
                'card ' +
                (props.card.isFaceUp ? 'face-up' : '') +
                ' ' +
                (props.card.isRemoved ? 'removed' : '')
            }
        >
            {!props.card.isRemoved && props.card.isFaceUp && props.card.emoji}
            {/* {!props.card.isRemoved && props.card.emoji} */}
        </div>
    );
}
