import { Request, Response, Application } from 'express';
import HttpStatusCodes from 'http-status-codes';
import Character from '../models/entities/Character';
import BaseController from './BaseController';
import Session from '../models/Session';

interface CharacterRequestBody {
    name: string;
    actor: string;
    image: string;
}

export default class CharactersController extends BaseController {
    protected initializeRouter(): void {
        this.router.all("*", Session.verifySessionToken);
        this.router.get('/', this.getCharacters);
        this.router.get('/:id', this.searchById);
        this.router.post('/', this.register);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }

    private async register(req: Request, res: Response): Promise<void> {
        try {
            const {
                name,
                actor,
                image
            } = <CharacterRequestBody>req.body;

            if (!name || !actor) {
                res.status(HttpStatusCodes.BAD_REQUEST).end();
                return;
            }

            const newChar = await Character.register(name, actor, image);

            res.status(HttpStatusCodes.OK).json(newChar);
        } catch (e) {
            if (e instanceof Error && e.message === 'DUPLICATE_ENTRIES') {
                res.status(HttpStatusCodes.CONFLICT).json({ warning: 'Name already exists' });
                return;
            }

            console.error(e);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
        }
    }

    private async getCharacters(_: Request, res: Response): Promise<void> {
        try {
            const characters = await Character.getAll();

            res.status(HttpStatusCodes.OK).json(characters);
        } catch (e) {
            console.error(e);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
        }
    }

    private async searchById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);

            const character = await Character.getById(id);

            res.status(HttpStatusCodes.OK).json(character);
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
                actor,
                image
            } = <CharacterRequestBody>req.body;

            if (!name || !actor) {
                res.status(HttpStatusCodes.BAD_REQUEST).end();
                return;
            }

            const id = parseInt(req.params.id);

            const character = await Character.getById(id);

            await character.update(name, actor, image);
    
            res.status(HttpStatusCodes.OK).json(character);
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
            await Character.getById(id);

            await Character.delete(id);
    
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

    public static mount(app: Application): CharactersController {
        return new CharactersController(app, '/characters');
    }
}
