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
const text_object = {
    teachers: {
        name: 'Imie',
        surname: 'Nazwisko',
        age: 'Wiek',
        subjects: 'Przedmioty'
    },
    classroom: {
        classroom: 'Numer pokoju',
        max_people: 'Maksymalna ilość ludzi',
        main_subjects: 'Przedmioty w klasie'
    },
    subjects: {
        subject: 'Nazwa przedmiotu',
        classroom: 'W klasie nr',
        lessons_hours: 'Ilość godzin lekcyjnych',
        mandatory: 'Czy obowiązkowe'
    }
};
window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Loaded");
    checkIfServerOnline();
    const btn_method = document.querySelectorAll('.database');
    btn_method.forEach(el => {
        el.addEventListener('click', () => switchText(el.value));
    });
    const btn_user = document.querySelector('#submit');
    btn_user.addEventListener("click", (event) => {
        let progress = 'user';
        let database_temp = '';
        let input = Input(progress, false);
        Input(progress, true);
        if (input === false) {
            window.alert('Did not select which method to use.');
            event.preventDefault();
            return;
        }
        ;
        if (typeof input !== 'boolean') {
            if (input.database_checked)
                database_temp = input.database_checked;
            const dataResponce = () => __awaiter(void 0, void 0, void 0, function* () {
                let data_server = yield getDataFromServer(input);
                if (typeof data_server === 'string' && data_server.length === 0) {
                    window.alert('Server returned answer without matching result');
                    return false;
                }
                ;
                return data_server;
            });
            console.log(input);
            dataResponce();
        }
        ;
        const btn_server = document.querySelector('#submit-to-server');
        btn_server.addEventListener("click", () => {
            progress = 'server';
            input = Input(progress, false);
            if (typeof input !== 'boolean') {
                input.database_checked = database_temp;
                getDataFromServer(input);
            }
            ;
        });
        event.preventDefault();
    });
});
function Input(progress, clear_input) {
    if (clear_input === true) {
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
    if (progress === 'user') {
        let database_checked = '';
        const database = document.querySelectorAll('.database');
        database.forEach(x => {
            if (x.checked === true)
                database_checked = x.value;
        });
        if (database_checked === '') {
            console.warn('Did not select which method use.');
            return false;
        }
        ;
        const name = document.querySelector("#first-field").value;
        const surname = document.querySelector("#second-field").value;
        const age = Number(document.querySelector("#third-field").value);
        const subjects = [document.querySelector("#fourth-field").value];
        return { database_checked, name, surname, age, subjects };
    }
    ;
    if (progress === 'server') {
        let method_checked = '';
        const method = document.querySelectorAll('.method');
        method.forEach(x => {
            if (x.checked === true)
                method_checked = x.value;
        });
        if (method_checked === '') {
            console.warn('Did not select which method use.');
            return false;
        }
        ;
        const name = document.querySelector("#first-field").value;
        const surname = document.querySelector("#second-field").value;
        const age = Number(document.querySelector("#third-field").value);
        const subjects = [document.querySelector("#fourth-field").value];
        return { method_checked, name, surname, age, subjects };
    }
    ;
    return false;
}
;
function switchText(method_text_change) {
    class input_field {
        constructor(id) {
            this.field = id;
        }
        ;
        returnSelect() {
            return document.querySelector(`#${this.field}`);
        }
        ;
    }
    ;
    let _field = new input_field('first-field-label');
    const first_field = _field.returnSelect();
    _field = new input_field('second-field-label');
    const second_field = _field.returnSelect();
    _field = new input_field('third-field-label');
    const third_field = _field.returnSelect();
    _field = new input_field('fourth-field-label');
    const fourth_field = _field.returnSelect();
    const field = {
        first: first_field,
        second: second_field,
        third: third_field,
        fourth: fourth_field,
    };
    const input_wrapper = document.querySelector('#inputs');
    input_wrapper.style.opacity = '1';
    input_wrapper.style.height = 'auto';
    const input = document.querySelector('#fourth-field');
    switch (method_text_change) {
        case 'classroom':
            field.first.innerText = text_object.classroom.classroom;
            field.first.setAttribute('value', 'classroom');
            field.second.innerText = text_object.classroom.max_people;
            field.second.setAttribute('value', 'max-people');
            field.third.innerText = text_object.classroom.main_subjects;
            field.third.setAttribute('value', 'main-subjects');
            field.fourth.style.display = 'none';
            input.style.display = 'none';
            break;
        case 'teachers':
            field.first.innerText = text_object.teachers.name;
            field.first.setAttribute('value', 'name');
            field.second.innerText = text_object.teachers.surname;
            field.second.setAttribute('value', 'surname');
            field.third.innerText = text_object.teachers.age;
            field.third.setAttribute('value', 'age');
            field.fourth.innerText = text_object.teachers.subjects;
            field.fourth.setAttribute('value', 'subjects');
            field.fourth.style.display = 'block';
            input.style.display = 'block';
            break;
        case 'subjects':
            field.first.innerText = text_object.subjects.subject;
            field.first.setAttribute('value', 'subject');
            field.second.innerText = text_object.subjects.classroom;
            field.second.setAttribute('value', 'classroom');
            field.third.innerText = text_object.subjects.lessons_hours;
            field.third.setAttribute('value', 'lessons_hours');
            field.fourth.innerText = text_object.subjects.mandatory;
            field.fourth.setAttribute('value', 'mandatory');
            field.fourth.style.display = 'block';
            input.style.display = 'block';
            break;
        default:
            break;
    }
    ;
}
;
function getDataFromServer(data_user) {
    return __awaiter(this, void 0, void 0, function* () {
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
        function sendToServer(url) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield fetch(url, {
                    method: data_user.method_checked,
                    headers: {
                        'Content-type': 'application/json; charset="utf-8"',
                    },
                    body: JSON.stringify(data_user)
                });
                return res;
            });
        }
        ;
        function deleteKeys() {
            var _a;
            for (const key in data_user) {
                if (data_user[key] === '' || undefined || null)
                    delete data_user[key];
                if (typeof data_user[key] === 'number' && data_user[key] === 0)
                    delete data_user[key];
                if (key === 'subjects') {
                    if (((_a = data_user.subjects) === null || _a === void 0 ? void 0 : _a.length) === 1 && data_user.subjects[0].length === 0)
                        delete data_user[key];
                }
                ;
            }
            ;
        }
        ;
        function createQuery() {
            let query_URI = '';
            const query_data = Object.assign({}, data_user);
            delete query_data.database_checked;
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
        if (data_user.method_checked === undefined) {
            url = `${base_url}/${data_user.database_checked}?${createQuery()}`;
            const res = yield sendToServerGet(url);
            const return_data = yield res.json();
            return_data.forEach(el => {
                displayResult(el.data, el.id);
            });
            return return_data;
        }
        else {
            url = `${base_url}/${data_user.database_checked}`;
            const res = yield sendToServer(url);
            const return_data = yield res.json();
            return_data.forEach(el => {
                displayResult(el.data, el.id);
            });
            return return_data;
        }
        ;
    });
}
;
function checkIfServerOnline() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(base_url, {
            method: 'GET',
        });
        console.log(`${yield res.text()}`);
    });
}
function displayResult(data, id) {
    function createList(data, id) {
        const user_input = document.querySelector('#user-data');
        user_input.setAttribute('style', 'display: none');
        const server_input = document.querySelector('#server-data');
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
    function addFromListToInputs(event) {
        const id = event.composedPath()[2].id;
        const list = document.querySelector(`#${id}`);
        const inputs = document.querySelectorAll(`.write`);
        const li = list.childNodes;
        inputs[0].value = li[0].innerText;
        inputs[1].value = li[1].innerText;
        inputs[2].value = li[2].innerText;
        try {
            inputs[3].value = li[3].innerText;
        }
        finally { }
        ;
    }
    ;
    createList(data, id);
}
;
console.log("Loaded client");
//# sourceMappingURL=client.js.map