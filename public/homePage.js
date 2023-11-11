"use strict";

// выход из ЛК
let logoutBtn = new LogoutButton();
logoutBtn.action = () => {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        }
    })
}

// получение информации о пользователе
ApiConnector.current(response => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
})

// получение текущих курсов валют
let rates = new RatesBoard();

function getStocks(board) {
    ApiConnector.getStocks(response => {
        if (response.success) {
            board.clearTable();
            board.fillTable(response.data);
        }
    })
}

let intervalId = null;
if (!intervalId) {
    getStocks(rates);
} 
intervalId = setInterval(() => getStocks(rates), 60000);

// ОПЕРАЦИИ С ДЕНЬГАМИ
let money = new MoneyManager();

// пополнение баланса
money.addMoneyCallback = data => {
    ApiConnector.addMoney({
        currency: data.currency, 
        amount: data.amount
    }, response => {
        if (!response.success) {
            money.setMessage(response.success, response.error);
        } else {
            ProfileWidget.showProfile(response.data);
            money.setMessage(response.success, "Баланс успешно пополнен");
        }
    })
}

// конвертация валюты
money.conversionMoneyCallback = data => {
    ApiConnector.convertMoney({
        fromCurrency: data.fromCurrency, 
        targetCurrency: data.targetCurrency, 
        fromAmount: data.fromAmount
    }, response => {
        if (!response.success) {
            money.setMessage(response.success, response.error);
        } else {
            ProfileWidget.showProfile(response.data);
            money.setMessage(response.success, "Конвертация успешна");
        }
    })
}

// перевод валюты
money.sendMoneyCallback = data => {
    ApiConnector.transferMoney({
        to: data.to, 
        currency: data.currency, 
        amount: data.amount
    }, response => {
        if (!response.success) {
            money.setMessage(response.success, response.error);
        } else {
            ProfileWidget.showProfile(response.data);
            money.setMessage(response.success, "Перевод успешен");
        }
    })
}

// ИЗБРАННОЕ
let fav = new FavoritesWidget();

// обновление данных на странице
function updateInfo(info, apiData) {
    info.clearTable();
    info.fillTable(apiData);
    money.updateUsersList(apiData);
}

// получение списка избранного
ApiConnector.getFavorites(response => {
    if (response.success) {
        updateInfo(fav, response.data);
    }
})

// добавление пользователя в избранное
fav.addUserCallback = data => {
    ApiConnector.addUserToFavorites({
        id: data.id,
        name: data.name
    }, response => {
        if (!response.success) {
            fav.setMessage(response.success, response.error);
        } else {
            updateInfo(fav, response.data);
            fav.setMessage(response.success, "Пользователь добавлен в адресную книгу");
        }
    })
}

// удаление пользователя из избранного
fav.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (!response.success) {
            fav.setMessage(response.success, response.error);
        } else {
            updateInfo(fav, response.data);
            fav.setMessage(response.success, "Пользователь удален из адресной книги");
        }
    })
}