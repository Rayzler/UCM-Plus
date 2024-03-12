import { Request, Response, Application } from 'express';
import HttpStatusCodes from 'http-status-codes';
import Movie from '../models/entities/Movie';
import Session from '../models/Session';
import BaseController from './BaseController';

interface MovieRequestBody {
    name: string;
    minutes: number;
    synopsis: string;
    image: string;
}

export default class MoviesController extends BaseController {
    protected initializeRouter(): void {
        this.router.all("*", Session.verifySessionToken);
        this.router.get('/', this.getMovies);
        this.router.get('/:id', this.searchById);
        this.router.post('/', this.register);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }

    private async register(req: Request, res: Response): Promise<void> {
        try {
            const {
                name,
                minutes,
                synopsis,
                image
            } = <MovieRequestBody>req.body;

            if (!name || !minutes || !synopsis) {
                res.status(HttpStatusCodes.BAD_REQUEST).end();
                return;
            }

            const newMovie = await Movie.register(name, minutes, synopsis, image);
            
            res.status(HttpStatusCodes.OK).json(newMovie);
        } catch (e) {
            if (e instanceof Error && e.message === 'DUPLICATE_ENTRIES') {
                res.status(HttpStatusCodes.CONFLICT).json({ warning: 'The movie already exists' });
                return;
            }

            console.error(e);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
        }
    }

    private async getMovies(req: Request, res: Response): Promise<void> {
        try {
            const movies = await Movie.getAll();

            res.status(HttpStatusCodes.OK).json(movies);
        } catch (e) {
            console.error(e);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
        }
    }

    private async searchById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const movie = await Movie.getById(id);

            res.status(HttpStatusCodes.OK).json(movie);
        } catch (e) {
            if (e instanceof Error && e.message === 'NOT_FOUND') {
                res.status(HttpStatusCodes.NOT_FOUND).end();
                return;
            }

            console.error(e);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
        }
    }

    private async update(req: Request, res: Response): Promise<void> {
        try {
            const {
                name,
                minutes,
                synopsis,
                image
            } = <MovieRequestBody>req.body;

            if (!name || !minutes || !synopsis) {
                res.status(HttpStatusCodes.BAD_REQUEST).end();
                return;
            }

            const id = parseInt(req.params.id);

            const movie = await Movie.getById(id);

            await movie.update(name, minutes, synopsis, image);
    
            res.status(HttpStatusCodes.OK).json(movie);
        } catch (e) {
            if (e instanceof Error && e.message === 'NOT_FOUND') {
                res.status(HttpStatusCodes.NOT_FOUND).end();
                return;
            }

            if (e instanceof Error && e.message === 'NAME_DUPLICATED') {
                res.status(HttpStatusCodes.CONFLICT).json({ warning: 'The name already exists' });
                return;
            }

            console.error(e);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
        }
    }

    private async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await Movie.getById(id);

            await Movie.delete(id);
    
            res.status(HttpStatusCodes.OK).json({message: "Deleted successful"});
        } catch (e) {
            if (e instanceof Error && e.message === 'NOT_FOUND') {
                res.status(HttpStatusCodes.NOT_FOUND).end();
                return;
            }
            
            console.error(e);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
        }
    }

    public static mount(app: Application): MoviesController {
        return new MoviesController(app, '/movies');
    }
}
