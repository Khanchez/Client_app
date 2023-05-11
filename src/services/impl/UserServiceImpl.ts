import type { LoginModel } from '@core/models/LoginModel';
import type { UserService } from '@core/services/UserService';
import { injectable } from 'inversify';

const loginUrl = 'api/user/login';
const getUserUrl = 'api/user/getUserByToken';


@injectable()
export class UserServiceImpl implements UserService {
    public user: any;

    public async login(loginModel: LoginModel): Promise<any> {
        let headers = new Headers();
        headers.set(`Content-Type`, `application/json`);

        let request: RequestInit = {
            method: `POST`,
            headers: headers,
            body: ``
        };
        if (loginModel) {
            request.body = JSON.stringify(loginModel)
        }

        const getTokenResult = await fetch(loginUrl, request);

        if (!getTokenResult.ok) {
            let responseData = await getTokenResult.text();
            return null;
        }

        let tokenString = await getTokenResult.text();
        if (!tokenString)
            return null;

        this.setToken(tokenString);
        this.user = await this.getUser();
        return this.user;
    }

    public async getUser() {
        if (this.user) {
            return this.user;
        }

        const token = this.getToken();
        let url = `${getUserUrl}?token=${token}`;

        let headers = new Headers();
        headers.set(`Content-Type`, `application/json`);
        let request: RequestInit = {
            method: `GET`,
            headers: headers
        };


        const getUserRes = await fetch(url, request);

        if (!getUserRes.ok) {
            let responseData = await getUserRes.text();
            return null;
        }

        let user = await getUserRes.json();
        this.user = user;
        return user;
    }

    public logOut() {
        this.setToken(``);
        this.user = null;
    }

    private setToken(token: string) {
        localStorage.setItem('vitroUserToken', token);
    }

    public getToken(): string | null {
        return localStorage.getItem('vitroUserToken')
    }


}