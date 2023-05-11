import { LoginModel } from '@core/models/LoginModel';

export interface UserService {

    login(loginModel: LoginModel): Promise<any>;

    getUser(): Promise<any>;

    logOut(): void;

    getToken(): string | null;
    
    user: any;
}