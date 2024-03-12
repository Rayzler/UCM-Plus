import { Request, Response, Application } from 'express';
import HttpStatusCodes from 'http-status-codes';
import Character from '../models/entities/Character';
import Movie from '../models/entities/Movie';
import Session from '../models/Session';
import BaseController from './BaseController';

interface CastRequestBody {
    characters: number[]
}

export default class CastController extends BaseController {
    protected initializeRouter(): void {
        this.router.all("*", Session.verifySessionToken);
        this.router.post('/:movieId', this.register);

        this.router.delete('/:movieId/:charId', this.delete);
    }

    private async register(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.movieId);
            let movie = await Movie.getById(id);

            const { characters } = <CastRequestBody>req.body;

            for (let n of characters) {
                const cId = parseInt(String(n));
                await Character.updateRelation(cId, movie);
            }

            movie = await Movie.getById(id);

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

    private async delete(req: Request, res: Response): Promise<void> {
        try {
            const idMovie = parseInt(req.params.movieId);
            const movie = await Movie.getById(idMovie);
            const idChar = parseInt(req.params.charId);

            await Character.deleteRelation(idChar, movie);

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

    public static mount(app: Application): CastController {
        return new CastController(app, '/cast');
    }
}
