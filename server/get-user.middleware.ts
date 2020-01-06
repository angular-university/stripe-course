
import {Request, Response, NextFunction} from 'express';


export function getUserMiddleware(req: Request, res: Response, next: NextFunction) {

    const jwt = req.headers.authorization;

    if (jwt) {

    }
    else {
        next();
    }
}
