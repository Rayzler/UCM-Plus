import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HttpStatusCodes from "http-status-codes";
import User from "./entities/User";

export default class Session {
    public sessionToken: string;

    private static readonly secret: string = "I am Iron Man";

    private constructor(sessionToken: string) {
        this.sessionToken = sessionToken;
    }

    public static CreateForUser(User: User): Session {
        const data = {
            idUsuario: User.id,
            fullname: User.fullname,
            username: User.username
        };

        const sessionToken = jwt.sign(
            {data},
            Session.secret,
            {
                expiresIn: "1d"
            }
        )

        return new Session(sessionToken);
    }

    // Middleware
    public static verifySessionToken(req: Request, res: Response, next: NextFunction): void {
        try {
            const sessionToken = <string>req.headers["Token-Sesion".toLowerCase()];

            if(!sessionToken) {
                res.status(HttpStatusCodes.UNAUTHORIZED).json({
                    "warning": "Session token not sent"
                });
                return;
            }

            jwt.verify(sessionToken, Session.secret);
            next();
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCodes.UNAUTHORIZED).json({
                "warning": "Invalid token"
            });
        }
    }
}