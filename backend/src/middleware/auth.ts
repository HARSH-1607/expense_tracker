import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AppError } from './errorHandler';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(new AppError('Unauthorized - Please log in', 401));
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = [];

  if (!req.body) {
    errors.push('Request body is missing');
  }

  if (errors.length > 0) {
    return next(new AppError(`Invalid request: ${errors.join(', ')}`, 400));
  }

  next();
}; 