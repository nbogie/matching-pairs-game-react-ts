import { clickAcknowledge } from "../features/gameSlice";
import { CardsView } from "./CardsView";
import { useAppSelector, useAppDispatch } from "../app/hooks";

export default function PairsGame() {
    const gameState = useAppSelector((state) => state.game);
    const dispatch = useAppDispatch();

    function handleClickOnMat() {
        if (gameState.turnStatus.title === "twoTurned") {
            dispatch(clickAcknowledge());
        }
    }

    return (
        <div className="mat" onClick={handleClickOnMat}>
            <CardsView />
            <div>TurnStatus: {gameState.turnStatus.title}</div>
            <div>Click count: {gameState.clickCount}</div>
        </div>
    );
}
