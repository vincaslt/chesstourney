import { post, AugmentedRequestHandler, get } from 'microrouter';
import { Types } from 'mongoose';
import { getAuth } from '../lib/utils/getAuth';
import { getParams } from '../lib/utils/getParams';
import { GameModel } from '../models/Game';
import { createError } from 'micro';
import { STATUS_ERROR } from '../lib/constants';
import { getBody } from '../lib/utils/getBody';
import { MoveDTO } from '../dto/MoveDTO';
import { Chess } from 'chessops/chess';
import { parseFen, makeFen } from 'chessops/fen';
import { isRefType } from '@typegoose/typegoose';

const makeAMove: AugmentedRequestHandler = async req => {
  const { userId } = getAuth(req);
  const { id } = getParams(req, ['id']);
  const dto = await getBody(req, MoveDTO);

  const game = await GameModel.findOne({
    _id: id,
    $or: [{ black: Types.ObjectId(userId) }, { white: Types.ObjectId(userId) }]
  });

  if (!game) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'Game not found');
  }

  if (Date.now() - game.lastMoveDate.getTime() >= game.millisPerMove) {
    throw createError(STATUS_ERROR.BAD_REQUEST, 'Game has already ended');
  }

  const fen = parseFen(game.lastPosition).unwrap();
  const position = Chess.fromSetup(fen).unwrap();

  if (
    (position.turn === 'white' &&
      isRefType(game.white) &&
      !Types.ObjectId(userId).equals(game.white)) ||
    (position.turn === 'black' &&
      isRefType(game.black) &&
      !Types.ObjectId(userId).equals(game.black))
  ) {
    throw createError(STATUS_ERROR.BAD_REQUEST, 'Invalid turn');
  }

  position.play(dto);
  game.history.push(dto);
  game.lastPosition = makeFen(position.toSetup());
  await game.save();
};

// TODO: Get game history and position

const getGame: AugmentedRequestHandler = async req => {
  const { id } = getParams(req, ['id']);

  const game = await GameModel.findOne({
    _id: id
  });

  if (!game) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'Game not found');
  }

  return game;
};

export const gameHandlers = [
  post('/game/:id/move', makeAMove),
  get('/game/:id', getGame)
];
