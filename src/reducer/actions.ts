import { Card } from "../gameCore/card";

export type FlipCardAction = { type: 'flipCard'; card: Card };
export type ResetAction = { type: 'reset' };
export type AcknowledgeAction = { type: 'clickAcknowledge' };

export type Action =
    | ResetAction
    | FlipCardAction
    | AcknowledgeAction;
