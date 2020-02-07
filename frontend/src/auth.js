import React from 'react';
import { Login } from './components/login';


export const auth = (valid, component) => {

    if (valid) {
        return component;
    }

    return (<Login/>);
}
