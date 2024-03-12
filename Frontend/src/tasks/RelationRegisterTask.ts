import MoviesService from "../services/MoviesService";
import Movie from "../models/Movie";

export default class RelationRegisterTask {
    private readonly movie: Movie;
    private readonly charactersList: number[];

    public constructor(movie: Movie, charactersList: number[]) {
        this.charactersList = charactersList;
        this.movie = movie;
    }

    public async execute(): Promise<void> {
        this.validate();
        await this.register();
    }

    private validate(): void {
        if (this.charactersList.length === 0) {
            throw new Error('IncompleteForm');
        }
    }

    public async register(): Promise<void> {
        const tokenSesion = localStorage.getItem('tokenSesion');

        if (!tokenSesion) {
            throw new Error('ExpiredOrInvalidSession');
        }

        const moviesService = new MoviesService(tokenSesion);
        await moviesService.registrarRelacion(this.movie.id, this.charactersList);
    }
}
