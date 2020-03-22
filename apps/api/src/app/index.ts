import { config } from 'dotenv';
import 'reflect-metadata';

config();

import * as microDev from 'micro-dev';
import serve from 'micro';
import * as mongoose from 'mongoose';
import { environment } from '../environments/environment';
import { withRouter } from './lib/decorators/withRouter';
import { withCors } from './lib/decorators/withCors';
import { authHandlers } from './handlers/auth';
import { userHandlers } from './handlers/user';
import { tournamentHandlers } from './handlers/tournament';
import { gameHandlers } from './handlers/game';
import { withErrorHandling } from './lib/decorators/withErrorHandling';

async function init() {
  if (!process.env.MONGODB_CONNECTION) {
    console.error('Missing env var MONGODB_CONNECTION');
    return;
  }

  await mongoose.connect(process.env.MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  console.info('Database connection established');

  const port = process.env.PORT || 3001;
  const handler = withCors(
    withErrorHandling(
      withRouter(userHandlers, authHandlers, tournamentHandlers, gameHandlers)
    ),
    [environment.appUrl]
  );

  console.info(`starting to listen on port ${port}`);

  if (environment.production) {
    serve(handler).listen(port);
  } else {
    microDev({ silent: false, limit: '1mb', host: '::', port })(handler);
  }
}

init();
