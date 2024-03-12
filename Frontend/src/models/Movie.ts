import Character from "./Character";

export default class Movie {
    public id: number;
    public name: string;
    public minutes: number;
    public synopsis: string;
    public image: string;
    public createdAt: Date;
    public updatedAt: Date;
    public characters: Character[];

    constructor(id: number | undefined, name: string, minutes: number, synopsis: string, image: string, createdAt?: Date, updatedAt?: Date, characters?: Character[]) {
        this.id = id as number;
        this.name = name;
        this.minutes = minutes;
        this.synopsis = synopsis;
        this.image = image;
        this.createdAt = createdAt as Date;
        this.updatedAt = updatedAt as Date;
        if (!characters)
            this.characters = [];
        else
            this.characters = characters;
    }
}