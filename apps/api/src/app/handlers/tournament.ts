import { post, AugmentedRequestHandler, get } from 'microrouter';
import { CreateTournamentDTO } from '../dto/CreateTournamentDTO';
import { getBody } from '../lib/utils/getBody';
import { getAuth } from '../lib/utils/getAuth';
import { TournamentInitFields, TournamentModel } from '../models/Tournament';
import { getParams } from '../lib/utils/getParams';
import { createError } from 'micro';
import { STATUS_ERROR } from '../lib/constants';
import { Types } from 'mongoose';
import { GameModel, GameInitFields } from '../models/Game';

const createTournament: AugmentedRequestHandler = async req => {
  const { userId } = getAuth(req);
  const dto = await getBody(req, CreateTournamentDTO);
  const tournament: TournamentInitFields = {
    ...dto,
    createdBy: userId,
    players: [userId]
  };

  return TournamentModel.create(tournament);
};

const joinTournament: AugmentedRequestHandler = async req => {
  const { userId } = getAuth(req);
  const { id } = getParams(req, ['id']);

  const tournament = await TournamentModel.findOne({
    _id: id,
    isStarted: false,
    createdBy: { $ne: userId }
  });

  if (!tournament) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'Tournament not found');
  }

  tournament.players.push(Types.ObjectId(userId));
  return tournament.save();
};

// TODO: transaction for game creation
const startTournament: AugmentedRequestHandler = async req => {
  const { userId } = getAuth(req);
  const { id } = getParams(req, ['id']);

  const tournament = await TournamentModel.findOne({
    _id: id,
    isStarted: false,
    createdBy: userId
  });

  if (!tournament) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'Tournament not found');
  }

  if (tournament.players.length < 2) {
    throw createError(STATUS_ERROR.BAD_REQUEST, 'Not enough players');
  }

  const games = [];

  for (let i = 0; i < tournament.players.length - 1; i++) {
    for (let j = i + 1; j < tournament.players.length; j++) {
      const player1 = tournament.players[i];
      const player2 = tournament.players[j];

      const game1: GameInitFields = {
        tournament,
        black: player1,
        white: player2,
        millisPerMove: tournament.millisPerMove
      };

      const game2: GameInitFields = {
        tournament,
        black: player2,
        white: player1,
        millisPerMove: tournament.millisPerMove
      };

      games.push(new GameModel(game1));
      games.push(new GameModel(game2));
    }
  }

  await GameModel.create(games);

  tournament.isStarted = true;
  return tournament.save();
};

const listTournaments: AugmentedRequestHandler = async req => {
  const { userId } = getAuth(req);

  const activeGames = await GameModel.find({
    $or: [
      { black: Types.ObjectId(userId) },
      {
        white: Types.ObjectId(userId)
      }
    ],
    outcome: { $exists: false },
    $where: 'this.lastMoveDate.getTime() > (Date.now() - this.millisPerMove)'
  });

  const tournaments = await TournamentModel.find({
    players: Types.ObjectId(userId)
  }).populate('players');

  const games = await GameModel.find({
    tournament: { $in: tournaments }
  });

  // const activeTournaments = (
  //   await Promise.all(
  //     tournaments.map(
  //       async tournament =>
  //         await GameModel.findOne({
  //           tournament: tournament.id,
  //           outcome: { $exists: false },
  //           $where:
  //             'this.lastMoveDate.getTime() > (Date.now() - this.millisPerMove)'
  //         })
  //     )
  //   )
  // )
  //   .filter((t): t is DocumentType<Game> => !!t)
  //   .map(({ id }) => id);

  return { activeGames, tournaments, games };
};

export const tournamentHandlers = [
  post('/tournament', createTournament),
  post('/tournament/:id/join', joinTournament),
  post('/tournament/:id/start', startTournament),
  get('/tournament', listTournaments)
];
