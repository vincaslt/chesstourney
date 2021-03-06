import { prop, getModelForClass, Ref, arrayProp } from '@typegoose/typegoose';
import { User } from './User';

export interface TournamentInitFields {
  name: string;
  createdBy: string;
  players: string[];
  millisPerMove: number;
}

export class Tournament {
  @prop({ required: true, unique: true, index: true })
  name: string;

  @prop({ required: true, ref: 'User' })
  createdBy: Ref<User>;

  @arrayProp({ required: true, ref: User })
  players: Ref<User>[];

  @prop({ require: true })
  millisPerMove: number;

  @prop({ default: false })
  isStarted: boolean;
}

export const TournamentModel = getModelForClass(Tournament, {
  schemaOptions: { timestamps: true }
});
