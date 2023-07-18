import { Card } from "../core/card";

export type FlipCardAction = { type: "flipCard"; card: Card };
type AcknowledgeAction = { type: "clickAcknowledge" };
type ResetAction = { type: "reset" };

export type Action = ResetAction | FlipCardAction | AcknowledgeAction;
