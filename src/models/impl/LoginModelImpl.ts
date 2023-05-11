export class LoginModelImpl {

    UserName: string;

    Password: string;

    constructor(userName: string, password: string) {
        this.Password = password;
        this.UserName = userName;
    }
}
