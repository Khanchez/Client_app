import React, { ChangeEvent, FunctionComponent, KeyboardEventHandler, useState } from 'react';

interface LoginInputProps {
    type: string,
    name: string,
    placeholder: string,
    onKeyPress: KeyboardEventHandler,
    onChange: Function,
    disabled: boolean
}

export const LoginInput: FunctionComponent<LoginInputProps> = (props: LoginInputProps) => {

    const [value, setValue] = useState('');

    let onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        props.onChange && props.onChange(e);
    }

    return (
        <div className="vitro-control">
            <div className="vitro-icon-control">
                <input
                    type={props.type}
                    name={props.name}
                    placeholder={props.placeholder}
                    value={value}
                    onChange={onEdit}
                    onKeyPress={props.onKeyPress}
                    disabled={props.disabled}
                />
            </div>
        </div>
    );
}