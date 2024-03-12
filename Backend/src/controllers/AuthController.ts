import { Request, Response, Application } from 'express';
import HttpStatusCodes from 'http-status-codes';
import User from '../models/entities/User';
import Session from '../models/Session';
import BaseController from './BaseController';

interface RegisterRequestBody {
    username: string;
    password: string;
    fullname: string;
    email: string;
}

interface LoginRequestBody {
    username: string;
    password: string;
}

export default class AuthController extends BaseController {
    protected initializeRouter(): void {
        this.router.post('/register', this.register);
        this.router.post('/login', this.login);
    }

    private async register(req: Request, res: Response): Promise<void> {
        try {
            const {
                username,
                password,
                fullname,
                email
            } = <RegisterRequestBody>req.body;

            if (!username || !password || !fullname || !email) {
                res.status(HttpStatusCodes.BAD_REQUEST).end();
                return;
            }

            const newUser = await User.register(username, password, fullname, email);
            const session = Session.CreateForUser(newUser);
    
            res.status(HttpStatusCodes.OK).json(session);
        } catch (e) {
            if (e instanceof Error) {
                if (e.message === 'DUPLICATE_USER_ENTRIES')
                    res.status(HttpStatusCodes.CONFLICT).json({ warning: 'Username already exists' });
                else if (e.message === 'DUPLICATE_EMAIL_ENTRIES')
                    res.status(HttpStatusCodes.CONFLICT).json({ warning: 'Email already exists' });

                return;
            }

            console.error(e);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
        }
    }

    private async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = <LoginRequestBody>req.body;

            if (!username || !password) {
                res.status(HttpStatusCodes.BAD_REQUEST).end();
                return;
            }
        
            const user = await User.searchByUser(username, password);
            const session = Session.CreateForUser(user);
            
            res.status(HttpStatusCodes.OK).json(session);
        } catch (e) {
            if (e instanceof Error) {
                if (e.message === 'USER_NOT_FOUND')
                    res.status(HttpStatusCodes.NOT_FOUND).end();
                else if (e.message === 'UNAUTHORIZED')
                    res.status(HttpStatusCodes.UNAUTHORIZED).end();
                return;
            }

            console.error(e);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
        }
    }

    public static mount(app: Application): AuthController {
        return new AuthController(app, '/auth');
    }
}
