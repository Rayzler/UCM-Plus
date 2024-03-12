import AuthService from "../services/AuthService";

interface RegisterRequestBody {
    username: string;
    password: string;
    fullname: string;
    email: string;
    verifyPassword: string;
}

export default class RegisterTask {
    private readonly formData: RegisterRequestBody;

    public constructor(formData: RegisterRequestBody) {
        this.formData = formData;
    }

    public async execute(): Promise<void> {
        this.validate();
        const tokenSesion = await this.register();
        localStorage.setItem('tokenSesion', tokenSesion);
    }

    private async register(): Promise<string> {
        const authService = new AuthService();

        const {
            fullname,
            username,
            password,
            email
        } = this.formData;

        return authService.registrarUsuario({
            fullname,
            username,
            password,
            email
        });
    }

    private validate(): void {
        const {
            fullname,
            username,
            password,
            email,
            verifyPassword
        } = this.formData;

        if (!fullname || !username || !password || !verifyPassword || !email) {
            throw new Error('IncompleteForm');
        }

        if (password !== verifyPassword) {
            throw new Error('PasswordsDoNotMatch');
        }
    }
}
