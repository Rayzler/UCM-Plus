import axios, {AxiosError} from 'axios';

interface RegisterRequestBody {
    username: string;
    password: string;
    fullname: string;
    email: string;
}

interface LoginRequestBody {
    username: string;
    password: string;
}

export default class AuthService {
    private readonly baseUrl: string;

    public constructor() {
        this.baseUrl = 'http://localhost:3001/auth';
    }

    public async registrarUsuario(registerData: RegisterRequestBody): Promise<string> {
        try {
            const res = await axios.post(
                `${this.baseUrl}/register`,
                registerData
            );
            return res.data.sessionToken as string;
        } catch (e) {
            if (e instanceof AxiosError) {
                switch (e.response?.status) {
                    case 400:
                        throw new Error('IncompleteForm');
                    case 409:
                        throw new Error('DuplicateUsername');
                    default:
                        throw new Error('UnknownError');
                }
            } else {
                throw e;
            }
        }
    }

    public async iniciarSesion(loginData: LoginRequestBody): Promise<string> {
        try {
            const res = await axios.post(
                `${this.baseUrl}/login`,
                loginData
            );
            return res.data.sessionToken as string;
        } catch (e) {
            if (e instanceof AxiosError) {
                switch (e.response?.status) {
                    case 400:
                        throw new Error('IncompleteForm');
                    case 401:
                        throw new Error('UsernameOrPasswordIncorrect');
                    case 404:
                        throw new Error('UserNotFound');
                    default:
                        throw new Error('UnknownError');
                }
            } else {
                throw e;
            }
        }
    }
}
