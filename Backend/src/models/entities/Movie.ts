import { Entity, PrimaryGeneratedColumn, Column, Repository, QueryFailedError, ManyToMany, DeleteResult } from 'typeorm';
import DatabaseConnection from '../../database/DatabaseConnection';
import Character from './Character';

@Entity({ name: 'movies' })
export default class Movie {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    public id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    public name: string;

    @Column({ type: 'int', nullable: false })
    public minutes: number;

    @Column({ type: 'varchar', length: 1000, nullable: false })
    public synopsis: string;

    @Column({ type: 'varchar', length: 750, nullable: true })
    public image: string;

    @ManyToMany(() => Character, (character) => character.movies)
    public characters: Character[];

    @Column({ type: 'datetime', nullable: false })
    public createdAt: Date;

    @Column({ type: 'datetime', nullable: false })
    public updatedAt: Date;

    private constructor(
        id: number | undefined,
        name: string,
        minutes: number,
        synopsis: string,
        image: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = <number>id;
        this.name = name;
        this.minutes = minutes;
        this.synopsis = synopsis;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static async register(name: string, minutes: number, synopsis: string, image: string): Promise<Movie> {
        const moviesRepository = await this.getMoviesRepository();

        const createdAt = new Date();

        const movie = new Movie(
            undefined,
            name,
            minutes,
            synopsis,
            image,
            createdAt,
            createdAt
        );

        try {
            await moviesRepository.save(movie);
        }
        catch (e) {
            if (e instanceof QueryFailedError && e.message.includes('ER_DUP_ENTRY')) {
                throw new Error('DUPLICATE_ENTRIES');
            }

            throw e;
        }

        return movie;
    }

    public static async getAll(): Promise<Movie[]> {
        const moviesRepository = await Movie.getMoviesRepository();
        return moviesRepository.find({
            relations: {
                characters: true,
            },
        });
    }

    public static async getById(id: number): Promise<Movie> {
        const moviesRepository = await Movie.getMoviesRepository();

        const movie = (await moviesRepository.find({
            relations: {
                characters: true,
            },
        })).filter(c => c.id === id)[0];

        if (!movie) {
            console.log("Movie not found");
            throw new Error('NOT_FOUND');
        }

        return movie;
    }

    public async update(name: string, minutes: number, synopsis: string, image: string): Promise<void> {
        this.name = name;
        this.minutes = minutes;
        this.synopsis = synopsis;
        this.image = image;
        this.updatedAt = new Date();

        const moviesRepository = await Movie.getMoviesRepository();

        try {
            await moviesRepository.save(this);
        } catch (e) {
            if (e instanceof QueryFailedError && e.message.includes('ER_DUP_ENTRY')) {
                throw new Error('NAME_DUPLICATED');
            }

            throw e;
        }
    }

    public static async delete(id: number): Promise<DeleteResult> {
        const moviesRepository = await Movie.getMoviesRepository();
        return await moviesRepository.delete(id);
    }

    private static async getMoviesRepository(): Promise<Repository<Movie>> {
        const databaseConnection = await DatabaseConnection.getConnectedInstance();
        return databaseConnection.getRepository(Movie);
    }
}
