"use strict";

let userForm = new UserForm();

// вход
userForm.loginFormCallback = data => {
    ApiConnector.login({
        login: data.login,
        password: data.password
    }, response => {
        if (!response.success) {
            userForm.setLoginErrorMessage(response.error);
        } else {
            location.reload();
        }
    })
}

// регистрация
userForm.registerFormCallback = data => {
    ApiConnector.register({
        login: data.login,
        password: data.password
    }, response => {
        if (!response.success) {
            userForm.setRegisterErrorMessage(response.error);
        } else {
            location.reload();
        }
    })
}