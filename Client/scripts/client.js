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
;
;
;
;
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
class InputClass {
    constructor() {
        this.checkDatabase();
        const mandatory_button = document.querySelector('#mandatory-button');
        switch (this.database) {
            case 'teachers':
                {
                    this.name = document.querySelector("#first-field").value;
                    this.surname = document.querySelector("#second-field").value;
                    this.age = Number(document.querySelector("#third-field").value);
                    this.subject = document.querySelector("#fourth-field").value;
                    this.type = 'input_teachers';
                    this.deleteKeys();
                    break;
                }
                ;
            case 'classrooms':
                {
                    this.classroom = Number(document.querySelector("#first-field").value);
                    this.max_people = Number(document.querySelector("#second-field").value);
                    this.main_subject = document.querySelector("#third-field").value;
                    this.type = 'input_classrooms';
                    this.deleteKeys();
                    break;
                }
                ;
            case 'subjects':
                {
                    this.subject = document.querySelector("#first-field").value;
                    this.classroom = Number(document.querySelector("#first-field").value);
                    this.lesson_hour = Number(document.querySelector("#second-field").value);
                    this.type = 'input_subjects';
                    if (mandatory_button.className === 'on')
                        this.mandatory = true;
                    else
                        this.mandatory = false;
                    this.deleteKeys();
                    break;
                }
                ;
        }
        ;
    }
    ;
    checkDatabase() {
        const database = document.querySelectorAll('.database');
        database.forEach(x => {
            if (x.checked === true)
                this.database = x.value;
        });
    }
    ;
    checkMethod() {
        const post_method = document.querySelector('#method-add-button');
        if (post_method.className === 'on')
            this.method = 'POST';
        else {
            const method = document.querySelectorAll('.method');
            method.forEach(x => {
                if (x.checked === true)
                    this.method = x.value;
            });
        }
        ;
    }
    ;
    deleteKeys() {
        if (this.name === undefined || this.name === '')
            delete this.name;
        if (this.surname === undefined || this.surname === '')
            delete this.surname;
        if (this.age === undefined || Number.isNaN(this.age) || this.age === 0)
            delete this.age;
        if (this.subject === undefined || this.subject === '')
            delete this.subject;
        if (this.classroom === undefined || Number.isNaN(this.classroom))
            delete this.classroom;
        if (this.max_people === undefined || Number.isNaN(this.max_people))
            delete this.max_people;
        if (this.main_subject === undefined || this.main_subject === '')
            delete this.main_subject;
        if (this.lesson_hour === undefined || Number.isNaN(this.lesson_hour))
            delete this.lesson_hour;
        if (this.mandatory === undefined)
            delete this.mandatory;
    }
    ;
    modifyMethod() {
        switch (this.database) {
            case 'teachers':
                {
                    this.name = document.querySelector("#first-modify-field").value;
                    this.surname = document.querySelector("#second-modify-field").value;
                    this.age = Number(document.querySelector("#third-modify-field").value);
                    this.subject = document.querySelector("#fourth-modify-field").value;
                    break;
                }
                ;
            case 'classrooms':
                {
                    this.classroom = Number(document.querySelector("#first-modify-field").value);
                    this.max_people = Number(document.querySelector("#second-modify-field").value);
                    this.main_subject = document.querySelector("#third-modify-field").value;
                    break;
                }
                ;
            case 'subjects':
                {
                    const mandatory_button_modify = document.querySelector('#mandatory-button-modify');
                    this.subject = document.querySelector("#first-modify-field").value;
                    this.classroom = Number(document.querySelector("#second-modify-field").value);
                    this.lesson_hour = Number(document.querySelector("#third-modify-field").value);
                    if (mandatory_button_modify.className === 'on')
                        this.mandatory = true;
                    else
                        this.mandatory = false;
                    this.deleteKeys();
                    break;
                    break;
                }
                ;
        }
        ;
    }
    ;
}
;
const database = document.querySelectorAll('.input-wrapper');
database.forEach(el => el.addEventListener('click', () => detectStart()));
function detectStart() {
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
        const inputs_validation = document.querySelectorAll('#inputs .write');
        let validate;
        //Function returning data from server or string with error message
        const dataResponce = (first, second) => __awaiter(this, void 0, void 0, function* () {
            typeof second !== 'undefined' ? yield getDataFromServer(first, second) : yield getDataFromServer(first);
        });
        //Checking if in validation every input is properly written
        inputs_validation.forEach(el => {
            if (!(el.placeholder) === false) {
                validate = false;
            }
        });
        if (validate === false)
            return;
        //Saving data which user input
        let input = new InputClass;
        input.checkMethod();
        //Clearing data in inputs for either choosing different data or staying clear
        inputClear();
        //If the user did not select the database we return an alert message
        if (input.database === undefined) {
            window.alert('Did not select database.');
            event_client.preventDefault();
            return;
        }
        else {
            console.log(input);
            dataResponce(input);
        }
        ;
        //This menu only shows when user did not select add method.
        const btn_server = document.querySelector('#submit-to-server');
        btn_server.addEventListener("click", (event_server) => {
            //We cleared all inputs before and need to send whole input type data.
            if (typeof input !== 'boolean')
                database_temp = input.database;
            input = new InputClass;
            if (typeof input !== 'boolean') {
                input.database = database_temp;
                input.checkMethod();
                const input_modify = new InputClass;
                input_modify.modifyMethod();
                input_modify.deleteKeys();
                inputClear();
                input.method === 'PUT' ? dataResponce(input, input_modify) : dataResponce(input);
            }
            ;
            event_server.preventDefault();
        });
        event_client.preventDefault();
    });
}
//Function clear user inputs
function inputClear() {
    const name = document.querySelector("#first-field");
    const surname = document.querySelector("#second-field");
    const age = document.querySelector("#third-field");
    const subjects = document.querySelector("#fourth-field");
    name.value = '';
    surname.value = '';
    age.value = '';
    subjects.value = '';
    return true;
}
;
//Function sending data to server as query or user data
//'data_to_send' - only accepts data with type InputClass
//'data_to_modify' - only exist when we choose 'PUT' method with the type of InputClass
function getDataFromServer(data_to_send, data_to_modify) {
    return __awaiter(this, void 0, void 0, function* () {
        delete data_to_send.type;
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
        //Function for 'POST', 'DELETE', 'PUT'
        //'url' - uses as short url to show which database we want to use
        //In body we pass 'data_to_send' with data inserted by user
        function sendToServer(url, data) {
            return __awaiter(this, void 0, void 0, function* () {
                const method_check = data_to_send.method;
                delete data_to_send.method;
                delete data_to_send.database;
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
            for (const key in data_to_send) {
                if (data_to_send[key] === '' || undefined || null)
                    delete data_to_send[key];
                if (typeof data_to_send[key] === 'number' && data_to_send[key] === 0)
                    delete data_to_send[key];
                if (key === 'subject') {
                    if (data_to_send.subject === undefined && !(data_to_send.type === 'input_classrooms'))
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
            delete query_data.database;
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
        if (data_to_send.method === undefined) {
            url = `${base_url}/${data_to_send.database}?${createQuery()}`;
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
            url = `${base_url}/${data_to_send.database}`;
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
            inputClear();
            addFromListToInputs(event);
            list.classList.toggle('search-result-green');
        });
    }
    ;
    //Function inserts data from lists to hidden inputs which we can later use
    function addFromListToInputs(event) {
        const id = event.composedPath()[2].id === '' ? event.composedPath()[0].id : event.composedPath()[2].id;
        console.log(id);
        const list = document.querySelector(`#${id}`);
        const inputs = document.querySelectorAll(`#inputs > .write`);
        const li = list.childNodes;
        li.forEach(el_li => {
            inputs.forEach(el_inputs => {
                var _a;
                if (el_li.className === ((_a = el_inputs.attributes.getNamedItem('for-attr')) === null || _a === void 0 ? void 0 : _a.value))
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