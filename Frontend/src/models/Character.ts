import Movie from "./Movie";

export default class Character {
    public id: number;
    public name: string;
    public actor: string;
    public image: string;
    public createdAt: Date;
    public updatedAt: Date;
    public movies: Movie[];

    constructor(id: number | undefined, name: string, actor: string, image: string, createdAt?: Date, updatedAt?: Date, movies?: Movie[]) {
        this.id = id as number;
        this.name = name;
        this.actor = actor;
        this.image = image;
        this.createdAt = createdAt as Date;
        this.updatedAt = updatedAt as Date;
        if (!movies)
            this.movies = [];
        else
            this.movies = movies;
    }
}