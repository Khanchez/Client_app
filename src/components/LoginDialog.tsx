import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import { cfgService, Button, Input } from '@vitrosoftware/common-ui'
import { useInjection } from 'inversify-react';
import { LoginInput } from './LoginInput'
import { LoginModelImpl } from '@core/models/impl/LoginModelImpl'
import type { UserService } from '@core/services/UserService'
import type { LocaleService } from '@core/services/LocaleService';
import * as FACTORY from '@core/constants/Factory';


interface ILoginDialogProps {
    setUser: Function
}

export const LoginDialog: FunctionComponent<ILoginDialogProps> = (props: ILoginDialogProps) => {

    const userService = useInjection<UserService>(FACTORY.SERVICE.USER);
    const localeService = useInjection<LocaleService>(FACTORY.SERVICE.LOCALE);

    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorText, setErrorText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [user, setUser] = useState<any | null>(null);


    function validateForm(): boolean {
        setErrorText(``);
        if (userName.trim() == '') {
            setErrorText(`Имя пользователя не может быть пустым`);
            return false;
        }
        if (password.trim() == '') {
            setErrorText(`Пароль не может быть пустым`);
            return false;
        }

        return true;
    }

    let submit = async () => {
        let valid = validateForm();
        if (!valid) {
            return;
        }
        setLoading(true);
        const loginModel = new LoginModelImpl(userName, password);
        let user = await userService.login(loginModel);
        setLoading(false);
        if (user == null) {
            setErrorText(`Пользователь не найдён`);
            return;
        }

        props.setUser(user);
        //cfgService.setItem('app.core.user', user);
    };

    let onEnterPress = e => {
        if (e.key === 'Enter') {
            submit();
        }
    }

    

    return (
        <div className="vitro-login-layout">
            <div className="vitro-form-login">
                <div className="vitro-logo"></div>

                <div className="vitro-heading-text">
                    <strong>{localeService.create('app.core.login.title', { productTitle: localeService.create('app.core.title', null) })}</strong>
                    <p>{localeService.create('app.core.login.description', null)}</p>
                </div>

                <LoginInput
                    placeholder={localeService.create('app.core.login.placeholder.name', null)}
                    name='username'
                    onKeyPress={onEnterPress}
                    type={''}
                    disabled={loading}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setUserName(e.target.value) }} />

                <LoginInput
                    type='password'
                    placeholder={localeService.create('app.core.login.placeholder.password', null)}
                    name='password'
                    onKeyPress={onEnterPress}
                    disabled={loading}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }} />

                <div className='vitro-color-red'>{errorText}</div>

                <div className="vitro-button-group">
                    <a></a>
                    <a className="vitro-link">{localeService.create('app.core.login.forgotPassword', null)}</a>
                </div>

                <Button
                    text={localeService.create('app.core.login.action', null)}
                    onClick={submit}
                    disabled={loading}
                />



                <div className="vitro-separator"></div>
                <div className="vitro-signup">
                    <span>{localeService.create('app.core.login.signup.title', null)}</span>
                    <br />
                    <a className="vitro-link">{localeService.create('app.core.login.signup.register', null)}</a>
                </div>

            </div>
        </div>
    );
}