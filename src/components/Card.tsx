import { useSpring, animated } from '@react-spring/web'

export interface Card {
    isFaceUp: boolean;
    emoji: string;
    id: number;
    isRemoved: boolean;
}

export interface CardProps {
    handleClickCard: (c: Card) => boolean;
    card: Card;
}
export function CardView(props: CardProps) {
    const [springs, api] = useSpring(() => ({
        from: { scale: 1.2, transform: "rotateY(0deg)" },
        to: { scale: 1 }
    })
    )

    //Something to aim for, perhaps: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_flip_card

    return (
        <animated.div
            style={{ ...springs }}
            onClick={(event) => {
                event.stopPropagation();
                const revealedACard = props.handleClickCard(props.card);
                revealedACard && api.start({
                    from: { scale: 1.2, transform: "rotateY(0deg)" },
                    to: { scale: 1, transform: "rotateY(180deg)" }
                });
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
        </animated.div>
    );
}
