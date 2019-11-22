import {Request, Response, NextFunction} from 'express';
import {auth} from './init-db';


export function getUserMiddleware(req: Request, res: Response, next: NextFunction) {

  const jwt = req.headers.authorization;

  if (jwt) {
    auth.verifyIdToken(jwt).then(jwtPayload => {
      req['uid'] = jwtPayload.uid;
      return next();
    }).catch((error) => {
      const message = 'Error verifying Firebase Id token';
      console.log(message, error);
      res.status(403).json({message});
    });
  }
}
