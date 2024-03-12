import Movie from "../models/Movie";
import MoviesService from "../services/MoviesService";

export default class MovieRegisterTask {
    private readonly movie: Movie;

    public constructor(movie: Movie) {
        this.movie = movie;
    }

    public async execute(): Promise<Movie> {
        this.validate();
        return await this.register();
    }

    private validate(): void {
        const { name, minutes, synopsis } = this.movie;

        if (!name || !minutes || minutes === 0 || !synopsis) {
            throw new Error('IncompleteForm');
        }
    }

    public async register(): Promise<Movie> {
        const tokenSesion = localStorage.getItem('tokenSesion');

        if (!tokenSesion) {
            throw new Error('ExpiredOrInvalidSession');
        }

        const moviesService = new MoviesService(tokenSesion);
        return await moviesService.registrar(this.movie);
    }
}
