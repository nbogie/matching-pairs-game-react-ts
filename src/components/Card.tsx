type Facing = "face-up" | "face-down";

export interface Card {
    readonly status: "removed" | Facing;
    readonly emoji: string;
    readonly id: number;
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
            className={"card " + props.card.status}
        >
            {props.card.status === "face-up" && props.card.emoji}
        </div>
    );
}
