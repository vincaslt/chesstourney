import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { INITIAL_EPD } from 'chessops/fen';
import { User } from './User';
import { Uci, Outcome } from 'chessops/types';
import { Tournament } from './Tournament';

// TODO: Calculate result from lastMoveDate+millisPerMove and png
/*
export enum GameResult {
  WHITE_WIN = '1-0',
  BLACK_WIN = '0-1',
  DRAW = '1/2-1/2'
}
*/

export interface GameInitFields {
  white: Ref<User>;
  black: Ref<User>;
  tournament: Ref<Tournament>;
  millisPerMove: number;
}

export class Game {
  @prop({ required: true, ref: User, index: true })
  white: Ref<User>;

  @prop({ required: true, ref: User, index: true })
  black: Ref<User>;

  @prop({ ref: Tournament, index: true })
  tournament?: Ref<Tournament>;

  @prop({ default: INITIAL_EPD })
  lastPosition: string;

  @prop({ default: [] })
  history: Uci[];

  @prop({ required: true })
  millisPerMove: number;

  @prop({ default: new Date() })
  lastMoveDate: Date;

  @prop()
  outcome?: Outcome;
}

export const GameModel = getModelForClass(Game, {
  schemaOptions: { timestamps: true }
});
