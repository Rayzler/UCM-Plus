import AuthService from "../services/AuthService";

interface LoginRequestBody {
    username: string;
    password: string;
}

export default class LoginTask {
    private readonly formData: LoginRequestBody;

    public constructor(formData: LoginRequestBody) {
        this.formData = formData;
    }

    public async execute(): Promise<void> {
        this.validateData();
        const tokenSesion = await this.login();
        localStorage.setItem('tokenSesion', tokenSesion);
    }

    private async login(): Promise<string> {
        const authService = new AuthService();
        console.log()
        const {
            username,
            password
        } = this.formData;

        return authService.iniciarSesion({
            username,
            password
        });
    }

    private validateData(): void {
        const {
            username,
            password
        } = this.formData;

        if (!username || !password) {
            throw new Error('IncompleteForm');
        }
    }
}
