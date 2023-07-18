import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { Card, CardView } from "./Card";
import { Leaderboard, LeaderboardEntry, LeaderboardView } from "./Leaderboard";
import { makeEmojisDeck } from "../core/makeEmojisDeck";
// import { useKeyPress } from './useKeyPress';

//differentiated union type
/** Whether a card has been turned, or two, or none yet.*/
type TurnStatus =
    | { title: "noneTurned" }
    | { title: "oneTurned"; firstCard: Card }
    | { title: "twoTurned"; firstCard: Card; secondCard: Card };

export default function PairsGame() {
    const [timeSinceFirstLoad, setTimeSinceFirstLoad] = useState(0);
    const [timeOfGameStart, setTimeOfGameStart] = useState<null | number>(null);
    const [clickCount, setClickCount] = useState(0);
    const [turnStatus, setTurnStatus] = useState<TurnStatus>({
        title: "noneTurned",
    });

    const [leaderboard, setLeaderboard] = useState<Leaderboard>([]);
    const [deck, setDeck] = useImmer<Card[]>(makeEmojisDeck());
    // const rPressed= useKeyPress("r", handleKeyDown);

    //increase timeSinceFirstLoad
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSinceFirstLoad((et) => et + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    function resetGame() {
        setClickCount(0);
        setDeck(makeEmojisDeck());
        setTurnStatus({ title: "noneTurned" });
        setTimeOfGameStart(timeSinceFirstLoad);
    }

    function cardsRemain() {
        return deck.filter((c) => c.status !== "removed").length > 0;
    }

    function processScore() {
        const entry: LeaderboardEntry = {
            elapsedTime: timeSinceFirstLoad - (timeOfGameStart || 0),
            clickCount,
            at: new Date(),
        };
        setLeaderboard((prevBoard: Leaderboard) => {
            const newBoard = [...prevBoard, entry];
            newBoard.sort((e1, e2) => e1.elapsedTime - e2.elapsedTime);
            return newBoard;
        });
    }

    // function handleKeyDown() {
    //     // Stale closure - this function definition is passed around and has closure over the var environment of a previous invocation of the PairsGame component function execution,
    //     // with old values for turnStatus.
    //     console.log('handleKeyDown in PairsGame', { turnStatus })
    //     if (turnStatus.title === 'twoTurned') {
    //         console.log('yes two are face up')
    //         handleClickWhenTwoCardsFaceUp()
    //     }
    // }

    function handleClickWhenTwoCardsFaceUp() {
        if (turnStatus.title === "twoTurned") {
            const { firstCard, secondCard } = turnStatus;
            setDeck((draft) => {
                const c1 = draft.find((dc) => dc.id === firstCard.id)!;
                const c2 = draft.find((dc) => dc.id === secondCard.id)!;

                if (firstCard.emoji === secondCard.emoji) {
                    c1.status = "removed";
                    c2.status = "removed";
                } else {
                    //otherwise, flip back down
                    c1.status = "face-down";
                    c2.status = "face-down";
                }

                console.log({ firstCard, secondCard, deck });
            });
            setTurnStatus({ title: "noneTurned" });
            if (!cardsRemain()) {
                processScore();
                resetGame();
            }
        }
    }

    function handleClickOnMat() {
        if (turnStatus.title === "twoTurned") {
            handleClickWhenTwoCardsFaceUp();
            return;
        }
    }

    function handleClickCard(c: Card) {
        if (turnStatus.title === "twoTurned") {
            handleClickWhenTwoCardsFaceUp();
            return;
        }

        if (c.status !== "face-down") {
            return;
        }

        setDeck((draft) => {
            const card = draft.find((dc) => dc.id === c.id)!;
            card.status = "face-up";
        });

        setClickCount((prev) => prev + 1);

        if (turnStatus.title === "noneTurned") {
            setTurnStatus({ title: "oneTurned", firstCard: c });
            return;
        }
        if (turnStatus.title === "oneTurned") {
            setTurnStatus({
                title: "twoTurned",
                firstCard: turnStatus.firstCard,
                secondCard: c,
            });
            return;
        }
    }

    return (
        <div className="mat" onClick={handleClickOnMat}>
            <div className="cardset">
                {deck.map((c, ix) => (
                    <CardView
                        card={c}
                        key={ix}
                        handleClickCard={handleClickCard}
                    />
                ))}
            </div>
            <div>TurnStatus: {turnStatus.title}</div>
            <div>Click count: {clickCount}</div>
            {timeOfGameStart && (
                <div>Elapsed Time: {timeSinceFirstLoad - timeOfGameStart}</div>
            )}
            <LeaderboardView leaderboard={leaderboard} />
        </div>
    );
}
