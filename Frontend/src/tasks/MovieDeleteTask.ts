import Movie from "../models/Movie";
import MoviesService from "../services/MoviesService";

export default class MovieDeleteTask {
    private readonly movie: Movie;

    public constructor(movie: Movie) {
        this.movie = movie;
    }

    public async execute(): Promise<void> {
        await this.eliminar();
    }

    public async eliminar(): Promise<void> {
        const tokenSesion = localStorage.getItem('tokenSesion');

        if (!tokenSesion) {
            throw new Error('ExpiredOrInvalidSession');
        }

        const moviesService = new MoviesService(tokenSesion);
        await moviesService.eliminar(this.movie.id);
    }
}
