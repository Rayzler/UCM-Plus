import axios, {AxiosError} from "axios";
import Character from "../models/Character";

interface CharacterRequestBody {
    id: number;
    name: string;
    actor: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

interface CharacterResponseBody {
    id: number;
    name: string;
    actor: string;
    image: string;
    movies: any[];
    createdAt: string;
    updatedAt: string;
}

export default class CharactersService {
    private readonly tokenSesion: string;

    private readonly baseUrl: string;

    public constructor(tokenSesion: string) {
        this.tokenSesion = tokenSesion;
        this.baseUrl = 'http://localhost:3001/characters';
    }

    private get headers() {
        return {
            'Token-Sesion': this.tokenSesion
        };
    }

    public async getList(): Promise<Character[]> {
        try {
            const res = await axios.get(
                this.baseUrl,
                {headers: this.headers}
            );

            return res.data.map(
                (movie: CharacterResponseBody) => (
                    new Character(
                        movie.id,
                        movie.name,
                        movie.actor,
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

    public async getById(id: number): Promise<Character> {
        try {
            const res = await axios.get(
                `${this.baseUrl}/${id}`,
                {headers: this.headers}
            );

            const {
                name,
                actor,
                image,
                createdAt,
                updatedAt,
                movies
            } = res.data as CharacterResponseBody;

            return new Character(
                id,
                name,
                actor,
                image,
                new Date(createdAt),
                new Date(updatedAt),
                movies
            );
        } catch (e) {
            if (e instanceof AxiosError && e.response) {
                switch (e.response.status) {
                    case 401:
                        throw new Error('ExpiredOrInvalidSession');
                    case 404:
                        throw new Error('CharacterNotFound');
                    default:
                        throw e;
                }
            }

            throw e;
        }
    }

    public async registrar(movie: Character): Promise<Character> {
        try {
            const res = await axios.post(
                this.baseUrl,
                movie,
                {headers: this.headers}
            );

            const {
                id,
                name,
                actor,
                image,
                createdAt,
                updatedAt
            } = res.data as CharacterRequestBody;

            return new Character(
                id,
                name,
                actor,
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
                        throw new Error('DuplicateCharacter');
                    default:
                        throw e;
                }
            }

            throw e;
        }
    }

    public async actualizar(movie: Character): Promise<Character> {
        try {
            const res = await axios.put(
                `${this.baseUrl}/${movie.id}`,
                movie,
                {headers: this.headers}
            );

            const {
                id,
                name,
                actor,
                image,
                createdAt,
                updatedAt
            } = res.data as CharacterRequestBody;

            return new Character(
                id,
                name,
                actor,
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
                        throw new Error('CharacterNotFound');
                    case 409: // Conflict
                        throw new Error('DuplicateCharacter');
                    default:
                        throw e;
                }
            }

            throw e;
        }
    }

    public async eliminar(id: number): Promise<void> {
        try {
            const res = await axios.delete(
                `${this.baseUrl}/${id}`,
                {headers: this.headers}
            );
        } catch (e) {
            if (e instanceof AxiosError && e.response) {
                switch (e.response.status) {
                    case 401: // Unauthorized
                        throw new Error('ExpiredOrInvalidSession');
                    case 404: // Not found
                        throw new Error('CharacterNotFound');
                    default:
                        throw e;
                }
            }

            throw e;
        }
    }
}
