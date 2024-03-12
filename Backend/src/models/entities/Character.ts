import { Entity, PrimaryGeneratedColumn, Column, Repository, QueryFailedError, ManyToMany, JoinTable, BaseEntity, DeleteResult } from 'typeorm';
import DatabaseConnection from '../../database/DatabaseConnection';
import Movie from './Movie';

@Entity({ name: 'characters' })
export default class Character extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    public id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    public name: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    public actor: string;

    @Column({ type: 'varchar', length: 750, nullable: true })
    public image: string;

    @ManyToMany(() => Movie, (movie) => movie.characters)
    @JoinTable({
        name: "movies_characters",
        joinColumn: {
            name: "character_id"
        }
    })
    public movies: Movie[];

    @Column({ type: 'datetime', nullable: false })
    public createdAt: Date;

    @Column({ type: 'datetime', nullable: false })
    public updatedAt: Date;

    public constructor(
        id: number | undefined,
        name: string,
        actor: string,
        image: string,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super();
        this.id = <number>id;
        this.name = name;
        this.actor = actor;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static async register(name: string, actor: string, image: string): Promise<Character> {
        const usersRespository = await this.getCharactersRepository();

        const createdAt = new Date();

        const character = new Character(
            undefined,
            name,
            actor,
            image,
            createdAt,
            createdAt
        );

        try {
            await usersRespository.save(character);
        }
        catch (e) {
            if (e instanceof QueryFailedError && e.message.includes('ER_DUP_ENTRY')) {
                throw new Error('DUPLICATE_ENTRIES');
            }

            throw e;
        }

        return character;
    }

    public static async getAll(): Promise<Character[]> {
        const charactersRepository = await Character.getCharactersRepository();
        return charactersRepository.find({
            relations: {
                movies: true,
            },
        });
    }

    public static async getById(id: number): Promise<Character> {
        const charactersRepository = await Character.getCharactersRepository();

        const character = (await charactersRepository.find({
            relations: {
                movies: true,
            },
        })).filter(c => c.id === id)[0];

        if (!character) {
            console.log("Character not found");
            throw new Error('NOT_FOUND');
        }

        return character;
    }

    public async update(
        name: string,
        actor: string,
        image: string
    ): Promise<void> {
        this.name = name;
        this.actor = actor;
        this.image = image;
        this.updatedAt = new Date();

        const charactersRepository = await Character.getCharactersRepository();

        try {
            await charactersRepository.save(this);
        } catch (e) {
            if (e instanceof QueryFailedError && e.message.includes('ER_DUP_ENTRY')) {
                throw new Error('NAME_DUPLICATED');
            }

            throw e;
        }
    }

    public static async delete(id: number): Promise<DeleteResult> {
        const charactersRepository = await Character.getCharactersRepository();
        return await charactersRepository.delete(id);
    }

    public static async updateRelation(id: number, movie: Movie): Promise<void> {
        const character = await this.getById(id);
        if (!character.movies)
            character.movies = [];

        character.movies.push(movie);

        const charactersRepository = await Character.getCharactersRepository();

        try {
            await charactersRepository.save(character);
        } catch (e) {
            console.log(e);
            
            throw e;
        }
    }

    public static async deleteRelation(id: number, movie: Movie): Promise<void> {
        const character = await this.getById(id);

        if (!character.movies.some(m => m.id === movie.id))
            throw new Error('NOT_FOUND');
            
        character.movies = character.movies.filter(m => m.id !== movie.id);

        const charactersRepository = await Character.getCharactersRepository();
        try {
            await charactersRepository.save(character);
        } catch (e) {
            console.log(e);
            
            throw e;
        }
    }

    private static async getCharactersRepository(): Promise<Repository<Character>> {
        const databaseConnection = await DatabaseConnection.getConnectedInstance();
        return databaseConnection.getRepository(Character);
    }
}
