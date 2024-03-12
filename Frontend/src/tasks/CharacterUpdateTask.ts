import Character from "../models/Character";
import CharactersService from "../services/CharactersService";

export default class CharacterUpdateTask {
    private readonly character: Character;

    public constructor(character: Character) {
        this.character = character;
    }

    public async execute(): Promise<void> {
        this.validate();
        await this.update();
    }

    private validate(): void {
        const { name, actor } = this.character;

        if (!name || !actor) {
            throw new Error('IncompleteForm');
        }
    }

    public async update(): Promise<void> {
        const tokenSesion = localStorage.getItem('tokenSesion');

        if (!tokenSesion) {
            throw new Error('ExpiredOrInvalidSession');
        }

        const charactersService = new CharactersService(tokenSesion);
        await charactersService.actualizar(this.character);
    }
}
