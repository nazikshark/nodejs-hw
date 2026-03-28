import createError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) return next(createError(401, 'Missing access token'));

  const session = await Session.findOne({ accessToken });
  if (!session) return next(createError(401, 'Session not found'));

  if (session.accessTokenValidUntil < new Date()) {
    return next(createError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);
  if (!user) return next(createError(401));

  req.user = user;
  next();
};