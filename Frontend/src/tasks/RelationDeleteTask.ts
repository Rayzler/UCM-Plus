import MoviesService from "../services/MoviesService";

export default class RelationDeleteTask {
    private readonly idMovie: number;
    private readonly idCharacter: number;

    constructor(idMovie: number, idCharacter: number) {
        this.idMovie = idMovie;
        this.idCharacter = idCharacter;
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
        await moviesService.eliminarRelacion(this.idMovie, this.idCharacter);
    }
}
