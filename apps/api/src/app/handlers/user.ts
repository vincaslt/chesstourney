import * as bcrypt from 'bcryptjs';
import { createError } from 'micro';
import { get, post, AugmentedRequestHandler } from 'microrouter';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { STATUS_ERROR } from '../lib/constants';
import { UserModel, UserInitFields } from '../models/User';
import { getBody } from '../lib/utils/getBody';
import { getAuth } from '../lib/utils/getAuth';
import { generateRandomString } from '../utils/string';
import { GameModel } from '../models/Game';
import { Types } from 'mongoose';

const createUser: AugmentedRequestHandler = async req => {
  const dto = await getBody(req, CreateUserDTO);
  const exists = await UserModel.exists({
    $or: [{ email: dto.email }, { username: dto.username }]
  });

  if (exists) {
    throw createError(STATUS_ERROR.BAD_REQUEST, 'User already exists');
  }

  const password = await bcrypt.hash(dto.password, 10);
  const verificationCode = generateRandomString(32);
  const user: UserInitFields = {
    ...dto,
    password,
    verificationCode
  };

  return UserModel.create(user);
};

const getAuthUserInfo: AugmentedRequestHandler = async req => {
  const { userId } = getAuth(req);

  const user = await UserModel.findById(userId);

  if (!user) {
    throw createError(STATUS_ERROR.NOT_FOUND, 'User not found');
  }

  const games = await GameModel.findOne({
    $or: [
      { black: Types.ObjectId(userId) },
      {
        white: Types.ObjectId(userId)
      }
    ],
    outcome: { $exists: false },
    $where: 'this.lastMoveDate.getTime() > (Date.now() - this.millisPerMove)'
  });

  // TODO: return tournaments with games

  return { user, games };
};

export const userHandlers = [
  post('/user', createUser),
  get('/user/me', getAuthUserInfo)
];
