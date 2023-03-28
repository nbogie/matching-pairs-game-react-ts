import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Card } from "../core/card";
import { clickAcknowledge, flipCard } from "../features/gameSlice";
import { CardView } from "./CardView";

export function CardsView() {
    const gameState = useAppSelector((state) => state.game);
    const dispatch = useAppDispatch();

    function handleClickCard(c: Card) {
        if (gameState.turnStatus.title === "twoTurned") {
            dispatch(clickAcknowledge());
        } else {
            dispatch(flipCard({ card: c }));
        }
    }

    return (
        <div className="cardset">
            {gameState.deck.map((c: Card) => (
                <CardView
                    card={c}
                    handleClickCard={handleClickCard}
                    key={c.id}
                />
            ))}
        </div>
    );
}
