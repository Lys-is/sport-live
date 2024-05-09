import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {store} = useContext(Context);

    return (
        <div className='form'>
            <label>Email
                <input
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    type="text"
                    placeholder='Email'
                />
            </label>
            <label>Password
                <input
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder='Пароль'
                />
            </label>
            <label>
                <button onClick={() => store.login(email, password)}>
                    Логин
                </button>
            </label>
            <label>
                <button onClick={() => store.registration(email, password)}>
                    Регистрация
                </button>
            </label>
        </div>
    );
};

export default observer(LoginForm);
