import Movie from "../models/Movie";
import axios, {AxiosError} from "axios";

interface MovieRequestBody {
    id: number;
    name: string;
    minutes: number;
    synopsis: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

interface MovieResponseBody {
    id: number;
    name: string;
    minutes: number;
    synopsis: string;
    image: string;
    characters: any[];
    createdAt: string;
    updatedAt: string;
}

export default class MoviesService {
    private readonly tokenSesion: string;

    private readonly baseUrl: string;

    public constructor(tokenSesion: string) {
        this.tokenSesion = tokenSesion;
        this.baseUrl = 'http://localhost:3001/movies';
    }

    private get headers() {
        return {
            'Token-Sesion': this.tokenSesion
        };
    }

    public async getList(): Promise<Movie[]> {
        try {
            const res = await axios.get(
                this.baseUrl,
                {headers: this.headers}
            );

            return res.data.map(
                (movie: MovieResponseBody) => (
                    new Movie(
                        movie.id,
                        movie.name,
                        movie.minutes,
                        movie.synopsis,
                        movie.image,
                        new Date(movie.createdAt),
                        new Date(movie.updatedAt)
                    )
                )
            );
        } catch (e) {
            if (e instanceof AxiosError && e.response) {
                switch (e.response.status) {
                    case 401:
                        throw new Error('ExpiredOrInvalidSession');
                    default:
                        throw e;
                }
            }

            throw e;
        }
    }

    public async getById(id: number): Promise<Movie> {
        try {
            const res = await axios.get(
                `${this.baseUrl}/${id}`,
                {headers: this.headers}
            );

            const {
                name,
                minutes,
                synopsis,
                image,
                createdAt,
                updatedAt,
                characters
            } = res.data as MovieResponseBody;

            return new Movie(
                id,
                name,
                minutes,
                synopsis,
                image,
                new Date(createdAt),
                new Date(updatedAt),
                characters
            );
        } catch (e) {
            if (e instanceof AxiosError && e.response) {
                switch (e.response.status) {
                    case 401:
                        throw new Error('ExpiredOrInvalidSession');
                    case 404:
                        throw new Error('MovieNotFound');
                    default:
                        throw e;
                }
            }

            throw e;
        }
    }

    public async registrar(movie: Movie): Promise<Movie> {
        try {
            const res = await axios.post(
                this.baseUrl,
                movie,
                {headers: this.headers}
            );

            const {
                id,
                name,
                minutes,
                synopsis,
                image,
                createdAt,
                updatedAt
            } = res.data as MovieRequestBody;

            return new Movie(
                id,
                name,
                minutes,
                synopsis,
                image,
                new Date(createdAt),
                new Date(updatedAt)
            );
        } catch (e) {
            if (e instanceof AxiosError && e.response) {
                switch (e.response.status) {
                    case 400: // Bad Request
                        throw new Error('IncompleteForm');
                    case 401: // Unauthorized
                        throw new Error('ExpiredOrInvalidSession');
                    case 409: // Conflict
                        throw new Error('DuplicateMovie');
                    default:
                        throw e;
                }
            }

            throw e;
        }
    }

    public async registrarRelacion(idMovie: number, idList: number[]): Promise<void> {

        try {
            await axios.post(
                `http://localhost:3001/cast/${idMovie}`,
                {characters: idList},
                {headers: this.headers}
            );

            return;
        } catch (e) {
            if (e instanceof AxiosError && e.response) {
                switch (e.response.status) {
                    case 400: // Bad Request
                        throw new Error('IncompleteForm');
                    case 401: // Unauthorized
                        throw new Error('ExpiredOrInvalidSession');
                    case 409: // Conflict
                        throw new Error('DuplicateMovie');
                    default:
                        throw e;
                }
            }

            throw e;
        }
    }

    public async actualizar(movie: Movie): Promise<Movie> {
        try {
            const res = await axios.put(
                `${this.baseUrl}/${movie.id}`,
                movie,
                {headers: this.headers}
            );

            const {
                id,
                name,
                minutes,
                synopsis,
                image,
                createdAt,
                updatedAt
            } = res.data as MovieRequestBody;

            return new Movie(
                id,
                name,
                minutes,
                synopsis,
                image,
                new Date(createdAt),
                new Date(updatedAt)
            );
        } catch (e) {
            if (e instanceof AxiosError && e.response) {
                switch (e.response.status) {
                    case 400: // Bad Request
                        throw new Error('IncompleteForm');
                    case 401: // Unauthorized
                        throw new Error('ExpiredOrInvalidSession');
                    case 404: // Not found
                        throw new Error('MovieNotFound');
                    case 409: // Conflict
                        throw new Error('DuplicateMovie');
                    default:
                        throw e;
                }
            }

            throw e;
        }
    }

    public async eliminar(id: number): Promise<void> {
        try {
            await axios.delete(
                `${this.baseUrl}/${id}`,
                {headers: this.headers}
            );
        } catch (e) {
            if (e instanceof AxiosError && e.response) {
                switch (e.response.status) {
                    case 401: // Unauthorized
                        throw new Error('ExpiredOrInvalidSession');
                    case 404: // Not found
                        throw new Error('MovieNotFound');
                    default:
                        throw e;
                }
            }

            throw e;
        }
    }

    public async eliminarRelacion(idMovie: number, idCharacter: number): Promise<void> {
        try {
            await axios.delete(
                `http://localhost:3001/cast/${idMovie}/${idCharacter}`,
                {headers: this.headers}
            );
        } catch (e) {
            if (e instanceof AxiosError && e.response) {
                switch (e.response.status) {
                    case 401: // Unauthorized
                        throw new Error('ExpiredOrInvalidSession');
                    case 404: // Not found
                        throw new Error('NotFound');
                    default:
                        throw e;
                }
            }
            throw e;
        }
    }
}
