"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const base_url = 'http://localhost:5500';
class ServerData {
    constructor(serverResponse) {
        if (serverResponse.data !== undefined) {
            this.msg = serverResponse.msg;
            this.code = Number(serverResponse.code);
            this.data = serverResponse.data;
        }
        else {
            this.msg = serverResponse.msg;
            this.code = Number(serverResponse.code);
        }
        ;
    }
    ;
}
;
window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Loaded");
    console.log('Checking connection with server...');
    const btn_user = document.querySelector('#submit');
    //Checking if server is online or offline
    checkServerStatus().then(x => {
        if (x === true)
            console.log('Server connected');
        else
            console.error('Could not connect to server');
    });
    //Adding event listener to button with id submit
    btn_user.addEventListener("click", (event_client) => {
        let database_temp = '';
        //Function returning data from server or string with error message
        const dataResponce = (first, second) => __awaiter(void 0, void 0, void 0, function* () {
            typeof second !== 'undefined' ? yield getDataFromServer(first, second) : yield getDataFromServer(first);
        });
        //Saving data which user input
        let input = Input('first-step');
        //Clearing data in inputs for either choosing different data or staying clear
        Input('clear');
        //If the user did not select database input returned a boolean value
        if (input === false) {
            window.alert('Did not select database.');
            event_client.preventDefault();
            return;
        }
        ;
        //If type is not boolean function start working with data
        if (typeof input !== 'boolean') {
            let input_no_data = 4;
            if (input.database_check === 'classroom')
                input_no_data = 3;
            if (input.age === 0)
                input_no_data--;
            if (input.name === '')
                input_no_data--;
            if (input.subjects.length === 1 && input.subjects[0] === '')
                input_no_data--;
            if (input.surname === '')
                input_no_data--;
            if (input_no_data === 0)
                return;
            console.log(input);
            dataResponce(input);
        }
        ;
        //This menu only shows when user did not select add method.
        const btn_server = document.querySelector('#submit-to-server');
        btn_server.addEventListener("click", (event_server) => {
            //We cleared all inputs before and need to send whole input type data.
            if (typeof input !== 'boolean')
                database_temp = input.database_check;
            input = Input('second-step');
            if (typeof input !== 'boolean') {
                input.database_check = database_temp;
                input.method_check === 'PUT' ? dataResponce(input, Input('modify')) : dataResponce(input);
            }
            ;
            event_server.preventDefault();
        });
        event_client.preventDefault();
    });
});
//Function save user input and have 3 options.
//'progress' which can be 'user' or 'server'
//'user' - needs to select at least one database and choose if he wants to add data inserted later
//'server' - only select left methods remove, modify or search
//'clear_input' - to clear inputss
function Input(progress) {
    switch (progress) {
        case 'clear':
            {
                const name = document.querySelector("#first-field");
                const surname = document.querySelector("#second-field");
                const age = document.querySelector("#third-field");
                const subjects = document.querySelector("#fourth-field");
                name.innerText = '';
                surname.innerText = '';
                age.innerText = '';
                subjects.innerText = '';
                return true;
            }
            ;
        case 'first-step':
            {
                let database_check = '';
                const post_method = document.querySelector('#method-add-button');
                const database = document.querySelectorAll('.database');
                database.forEach(x => {
                    if (x.checked === true)
                        database_check = x.value;
                });
                if (database_check === '') {
                    console.warn('Did not select which database use.');
                    return false;
                }
                ;
                const name = document.querySelector("#first-field").value;
                const surname = document.querySelector("#second-field").value;
                const age = Number(document.querySelector("#third-field").value);
                const subjects = [document.querySelector("#fourth-field").value];
                const method_check = 'POST';
                if (post_method.className === 'add-on')
                    return { database_check, name, surname, age, subjects, method_check };
                else
                    return { database_check, name, surname, age, subjects };
            }
            ;
        case 'second-step':
            {
                let method_check = '';
                const method = document.querySelectorAll('.method');
                method.forEach(x => {
                    if (x.checked === true)
                        method_check = x.value;
                });
                if (method_check === '') {
                    console.warn('Did not select which method use.');
                    return false;
                }
                ;
                const name = document.querySelector("#first-field").value;
                const surname = document.querySelector("#second-field").value;
                const age = Number(document.querySelector("#third-field").value);
                const subjects = [document.querySelector("#fourth-field").value];
                return { method_check, name, surname, age, subjects };
            }
            ;
        case 'modify':
            {
                const name = document.querySelector("#first-modify-field").value;
                const surname = document.querySelector("#second-modify-field").value;
                const age = Number(document.querySelector("#third-modify-field").value);
                const subjects = [document.querySelector("#fourth-modify-field").value];
                if (subjects.length === 1 && subjects[0] === '')
                    return { name, surname, age };
                else
                    return { name, surname, age, subjects };
            }
            ;
        default:
            {
                return false;
            }
            ;
    }
    ;
}
;
//Function sending data to server as query or user data
//'data_to_send' - only accepts data with type input
function getDataFromServer(data_to_send, data_to_modify) {
    return __awaiter(this, void 0, void 0, function* () {
        //Function only for 'GET' method
        //'url' - 'GET' method only send data in form of query
        function sendToServerGet(url) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset="utf-8"',
                    }
                });
                return res;
            });
        }
        ;
        //Function for 'POST', 'DELETE', 'PPUT'
        //'url' - uses as short url to show which database we want to use
        //In body we pass 'data_to_send' with data inserted by user
        function sendToServer(url, data) {
            return __awaiter(this, void 0, void 0, function* () {
                const method_check = data_to_send.method_check;
                delete data_to_send.method_check;
                delete data_to_send.database_check;
                const res = yield fetch(url, {
                    method: method_check,
                    headers: {
                        'Content-type': 'application/json; charset="utf-8"',
                    },
                    body: JSON.stringify(data),
                });
                return res;
            });
        }
        ;
        //Function delete unused keys.
        function deleteKeys() {
            var _a;
            for (const key in data_to_send) {
                if (data_to_send[key] === '' || undefined || null)
                    delete data_to_send[key];
                if (typeof data_to_send[key] === 'number' && data_to_send[key] === 0)
                    delete data_to_send[key];
                if (key === 'subjects') {
                    if (((_a = data_to_send.subjects) === null || _a === void 0 ? void 0 : _a.length) === 1 && data_to_send.subjects[0].length === 0)
                        delete data_to_send[key];
                }
                ;
            }
            ;
        }
        ;
        //Function creates query for 'GET' method
        function createQuery() {
            let query_URI = '';
            const query_data = Object.assign({}, data_to_send);
            delete query_data.database_check;
            for (const key in query_data) {
                if (query_URI === '')
                    query_URI = `${key}=${query_data[key]}`;
                else
                    query_URI = `${query_URI}&${key}=${query_data[key]}`;
            }
            ;
            return query_URI;
        }
        ;
        let url = '';
        deleteKeys();
        //If 'method_check' is not present function first check if data is not present in databases
        //If it returns data function will display it for easier use.
        //If 'method_check' is present it means that we want to do a specific task to proceed
        if (data_to_send.method_check === undefined) {
            url = `${base_url}/${data_to_send.database_check}?${createQuery()}`;
            const res = yield sendToServerGet(url);
            const return_data = new ServerData(yield res.json());
            if (return_data.code === 0o0013) {
                displayMessage(return_data.msg);
                return return_data;
            }
            if (return_data.data !== undefined && Array.isArray(return_data.data))
                return_data.data.forEach(el => {
                    displayResult(el.data, el.id);
                });
            return return_data;
        }
        else {
            url = `${base_url}/${data_to_send.database_check}`;
            const res = yield sendToServer(url, { data_to_send, data_to_modify });
            const return_data = new ServerData(yield res.json());
            switch (return_data.code) {
                case 0o0001:
                    displayMessage(return_data.msg);
                    break;
                case 0o0002:
                    displayMessage(return_data.msg);
                    break;
                case 0o0011:
                    displayMessage(return_data.msg);
                    break;
                case 0o0101:
                    displayMessage(return_data.msg);
                    break;
                default:
                    console.log('Something went wrong.');
                    console.log(return_data);
                    break;
            }
            ;
        }
        ;
    });
}
;
//Simply synchronus function to check if server is online or offline
function checkServerStatus() {
    const res = fetch(`${base_url}/server_status`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset="utf-8"',
        }
    });
    return res.then(response => {
        console.log(response.status);
        if (response.status === 200) {
            return true;
        }
        else
            return false;
    }).catch(error => {
        console.error(`This is error: ${error}`);
        return false;
    });
}
//Function for displaying second step menus
function displayResult(data, id, method) {
    //If sent data for 'POST' method returns data from the server with similar data inserted by the user
    //On client side will appear simple menu for confirmation to realize his request even if the data is similar
    if (method === 'POST') {
        const force_post = document.querySelector('#force-post');
        force_post.setAttribute('style', '');
    }
    ;
    //Function create list with id and data returned by server
    function createList(data, id) {
        const user_input = document.querySelector('#first-step');
        user_input.setAttribute('style', 'display: none');
        const server_input = document.querySelector('#second-step');
        server_input.setAttribute('style', '');
        const display_status_box = document.querySelector('#display-status');
        const list = document.createElement('ul');
        display_status_box.appendChild(list);
        list.setAttribute('id', `${id}`);
        list.setAttribute('class', 'search-result');
        for (const key in data) {
            const li_element = document.createElement('li');
            const p_element = document.createElement('p');
            const select_ul = document.getElementById(`${id}`);
            select_ul.insertAdjacentElement('beforeend', li_element);
            li_element.setAttribute('id', `${key}-${id}-li`);
            li_element.setAttribute('class', key);
            const select_li = document.getElementById(`${key}-${id}-li`);
            select_li.insertAdjacentElement('beforeend', p_element);
            p_element.setAttribute('id', `${key}-${id}-p`);
            const select_p = document.getElementById(`${key}-${id}-p`);
            select_p.textContent = String(data[key]);
        }
        ;
        list.addEventListener('click', (event) => {
            addFromListToInputs(event);
            list.classList.toggle('search-result-green');
        });
    }
    ;
    //Function inserts data from lists to hidden inputs which we can later use
    function addFromListToInputs(event) {
        const id = event.composedPath()[2].id;
        console.log(id);
        const list = document.querySelector(`#${id}`);
        const inputs = document.querySelectorAll(`#inputs > .write`);
        const li = list.childNodes;
        li.forEach(el_li => {
            inputs.forEach(el_inputs => {
                if (el_li.className === el_inputs.attributes.getNamedItem('for-attr').value)
                    el_inputs.value = el_li.innerText;
            });
        });
    }
    ;
    createList(data, id);
}
;
function displayMessage(msg) {
    const p_element = document.createElement('p');
    const select_div = document.querySelector('#display-status');
    select_div.insertAdjacentElement('beforeend', p_element);
    p_element.textContent = msg;
}
;
console.log("Loaded client");
//# sourceMappingURL=client.js.map