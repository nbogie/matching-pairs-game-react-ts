import React, { useEffect, useState } from "react";
import { Leaderboard, LeaderboardEntry, LeaderboardView } from "./Leaderboard";
import { Card, CardView } from "./Card";
import { makeEmojisDeck } from "./Deck";
import useSound from "use-sound";
import matchSound from "../sounds/match.wav";
// import { useKeyPress } from './useKeyPress';

//differentiated union type
/** Whether a card has been turned, or two, or none yet.*/
type TurnStatus =
    | { title: "noneTurned" }
    | { title: "oneTurned"; firstCard: Card }
    | { title: "twoTurned"; firstCard: Card; secondCard: Card };
export default function PairsGame() {
    const [play] = useSound(matchSound);
    const [deck, setDeck] = useState<Card[]>(makeEmojisDeck());
    const [turnStatus, setTurnStatus] = useState<TurnStatus>({
        title: "noneTurned",
    });

    const [timeSinceFirstLoad, setTimeSinceFirstLoad] = useState(0);
    const [timeOfGameStart, setTimeOfGameStart] = useState<null | number>(null);
    const [leaderboard, setLeaderboard] = useState<Leaderboard>([]);
    const [clickCount, setClickCount] = useState(0);

    // const rPressed= useKeyPress("r", handleKeyDown);

    //increase timeSinceFirstLoad.  TODO: use useInterval
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

    function cardsRemain(givenDeck: Card[]) {
        return givenDeck.some((c) => !c.isRemoved);
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
            //we make copies rather than reference cards in original deck
            const pickedCards: [Card, Card] = [
                { ...deck.find((c) => c.id === turnStatus.firstCard.id)! },
                { ...deck.find((c) => c.id === turnStatus.secondCard.id)! },
            ];

            if (pickedCards[0].emoji === pickedCards[1].emoji) {
                pickedCards.forEach((c) => (c.isRemoved = true));
            }
            //in either case, unflip.
            pickedCards.forEach((c) => (c.isFaceUp = false));

            const newDeck = replaceCardsInDeck(pickedCards, deck);
            setDeck(newDeck);
            setTurnStatus({ title: "noneTurned" });

            if (!cardsRemain(newDeck)) {
                processScore();
                resetGame();
            }
        }
    }

    function replaceCardsInDeck(replacements: Card[], deck: Card[]): Card[] {
        return deck.map((c) => replacements.find((pc) => pc.id === c.id) ?? c);
    }
    function handleClickOnMat() {
        if (turnStatus.title === "twoTurned") {
            handleClickWhenTwoCardsFaceUp();
            return;
        }
    }

    /** @returns true if the click revealed a card */
    function handleClickCard(c: Card): boolean {
        const status = turnStatus.title;

        if (status === "twoTurned") {
            handleClickWhenTwoCardsFaceUp();
            return false;
        }

        if (c.isRemoved) {
            console.error("Clicked card which has been removed!");
            return false;
        }

        if (c.isFaceUp) {
            return false;
        }
        //TODO: don't mutate card
        c.isFaceUp = true;
        setClickCount((prev) => prev + 1);

        if (status === "noneTurned") {
            setTurnStatus({ title: "oneTurned", firstCard: c });
            return true;
        }
        if (status === "oneTurned") {
            setTurnStatus({
                title: "twoTurned",
                firstCard: turnStatus.firstCard,
                secondCard: c,
            });
            if (turnStatus.firstCard.emoji === c.emoji) {
                play();
            }

            return true;
        }
        return false;
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
