import express, { Application } from 'express';
import bodyParser from 'body-parser';
import AuthController from './controllers/AuthController';
import MoviesController from './controllers/MoviesController';
import CharactersController from './controllers/CharactersControllers';
import CastController from './controllers/CastController';
import cors, {CorsOptions} from "cors";

const app: Application =  express();

const corsOption: CorsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};

app.use(cors(corsOption));
app.use(bodyParser.json());

AuthController.mount(app);
MoviesController.mount(app);
CharactersController.mount(app);
CastController.mount(app);

export default app;
