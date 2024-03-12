import Character from "../models/Character";
import CharactersService from "../services/CharactersService";

export default class CharacterDeleteTask {
    private readonly character: Character;

    public constructor(character: Character) {
        this.character = character;
    }

    public async execute(): Promise<void> {
        await this.eliminar();
    }

    public async eliminar(): Promise<void> {
        const tokenSesion = localStorage.getItem('tokenSesion');

        if (!tokenSesion) {
            throw new Error('ExpiredOrInvalidSession');
        }

        const charactersService = new CharactersService(tokenSesion);
        await charactersService.eliminar(this.character.id);
    }
}
