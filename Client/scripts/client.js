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
    const btn_database = document.querySelectorAll('.database');
    btn_database.forEach(el => {
        el.addEventListener('click', () => switchText(el.value));
    });
    const btn = document.querySelector('#submit');
    btn.addEventListener("click", (event) => {
        const input = saveInput();
        if (input === false) {
            window.alert('Did not select which method to use.');
            event.preventDefault();
            return;
        }
        ;
        sendRequest(input);
        console.log(input);
        event.preventDefault();
    });
});
function switchText(database_text_change) {
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
    switch (database_text_change) {
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
function saveInput() {
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
    let database_checked = '';
    const database = document.querySelectorAll('.database');
    database.forEach(x => {
        if (x.checked === true)
            database_checked = x.value;
    });
    if (database_checked === '') {
        console.warn('Did not select which database use.');
        return false;
    }
    ;
    const name = document.querySelector("#first-field").value;
    const surname = document.querySelector("#second-field").value;
    const age = Number(document.querySelector("#third-field").value);
    const subjects = [document.querySelector("#fourth-field").value];
    return { method_checked, database_checked, name, surname, age, subjects };
}
;
function sendRequest(data, short_data) {
    return __awaiter(this, void 0, void 0, function* () {
        function sendToServer(url) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield fetch(url, {
                    method: (data === null || data === void 0 ? void 0 : data.method_checked) || (short_data === null || short_data === void 0 ? void 0 : short_data.method_checked),
                    headers: {
                        'Content-type': 'application/json; charset="utf-8"',
                    },
                    body: JSON.stringify({
                        data: data || short_data,
                    })
                });
                return res;
            });
        }
        ;
        function deleteKeys() {
            var _a;
            for (const key in data) {
                if (data[key] === '' || undefined || null)
                    delete data[key];
                if (typeof data[key] === 'number' && data[key] === 0)
                    delete data[key];
                if (key === 'subjects') {
                    if (((_a = data.subjects) === null || _a === void 0 ? void 0 : _a.length) === 1 && data.subjects[0].length === 0)
                        delete data[key];
                }
                ;
            }
            ;
        }
        ;
        function createQuery() {
            let query_URI = '';
            const query_data = Object.assign({}, data);
            delete query_data.database_checked;
            delete query_data.method_checked;
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
        if (data === undefined && short_data === undefined) {
            console.log('No data to send to server');
            return false;
        }
        ;
        let url = ``;
        let received_data = undefined;
        if (data === undefined && short_data !== undefined) {
            url = `${base_url}/${short_data.database_checked}?id=${short_data.id}`;
            const res = yield sendToServer(url);
            received_data = yield res.json();
            console.log(received_data);
        }
        ;
        if (data !== undefined && short_data === undefined) {
            deleteKeys();
            const query = createQuery();
            console.log(query);
            if (data.method_checked === 'DELETE' || data.method_checked === 'MODIFY' || data.method_checked === 'GET')
                url = `${base_url}/${data.database_checked}?${query}`;
            if (data.method_checked === 'POST')
                url = `${base_url}/${data.database_checked}`;
            const res = yield sendToServer(url);
            received_data = yield res.json();
            console.log(received_data);
        }
        ;
        if (received_data !== undefined) {
            displayResult(received_data, 'teachers');
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
function displayResult(returnedId, file) {
    function getInfoFromDatabase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${base_url}/Database/${file}?id=${id}`;
            const res = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
            return yield res.json();
        });
    }
    ;
    function createList(data, id) {
        const box = document.querySelector('#display-status');
        const list = document.createElement('ul');
        box.appendChild(list);
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
    const database = [];
    returnedId.forEach((el) => __awaiter(this, void 0, void 0, function* () {
        console.log(el.id);
        database.unshift(yield getInfoFromDatabase(el.id));
        createList(database[0], el.id);
    }));
}
;
console.log("Loaded client");
//# sourceMappingURL=client.js.map