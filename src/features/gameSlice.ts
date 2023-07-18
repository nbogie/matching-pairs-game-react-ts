import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { Card } from "../core/card";
import { makeEmojisDeck } from "../core/makeEmojisDeck";
import { handleClickWhenTwoCardsFaceUp } from "./gameSlice/handleClickWhenTwoCardsFaceUp";
import { handleFlipCard } from "./gameSlice/handleFlipCard";
import { handleResetGame } from "./gameSlice/handleResetGame";

export interface GameState {
    clickCount: number;
    turnStatus: TurnStatus;
    deck: Card[];
}

export type TurnStatus =
    | { title: "noneTurned" }
    | { title: "oneTurned"; firstCard: Card }
    | { title: "twoTurned"; firstCard: Card; secondCard: Card };

export const initialState: GameState = {
    clickCount: 0,
    turnStatus: {
        title: "noneTurned",
    },
    deck: makeEmojisDeck(),
};

export const gameSlice = createSlice({
    name: "game",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        flipCard: (state, action: PayloadAction<{ card: Card }>) =>
            handleFlipCard(state, action),
        clickAcknowledge: (state) => handleClickWhenTwoCardsFaceUp(state),
        resetGame: (state) => handleResetGame(state),
    },
});

export const { clickAcknowledge, flipCard, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
