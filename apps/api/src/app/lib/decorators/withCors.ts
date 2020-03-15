import { RequestHandler, send } from 'micro';
import { STATUS_SUCCESS, STATUS_ERROR } from '../constants';
import { environment } from '../../../environments/environment';

const ALLOW_METHODS = ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

const ALLOW_HEADERS = [
  'X-Requested-With',
  'Access-Control-Allow-Origin',
  'X-HTTP-Method-Override',
  'Content-Type',
  'Authorization',
  'Accept'
];

const MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

export function withCors(handler: RequestHandler, allowedOrigins: string[]): RequestHandler {
  return async (req, res) => {
    const origin = Array.isArray(req.headers.origin)
      ? req.headers.origin[0]
      : req.headers.origin;

    if (!environment.production) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (!origin || !allowedOrigins.includes(origin)) {
      return send(res, STATUS_ERROR.FORBIDDEN);
    } else {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', ALLOW_METHODS.join(','));
      res.setHeader('Access-Control-Allow-Headers', ALLOW_HEADERS.join(','));
      res.setHeader('Access-Control-Max-Age', String(MAX_AGE_SECONDS));
      return send(res, STATUS_SUCCESS.OK);
    }

    return await handler(req, res);
  };
}
