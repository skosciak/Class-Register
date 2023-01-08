const base_url = 'http://localhost:5500';

type input = {
    method_checked: string,
    database_checked: string,
    name: string,
    surname: string,
    age: number,
    subjects: string[] | undefined
};

type short_input = {
    id: string,
    database_checked: string,
    method_checked: string,
};

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
    const btn_database: NodeListOf<HTMLInputElement> = document.querySelectorAll('.database') as NodeListOf<HTMLInputElement>;
    btn_database.forEach(el => {
        el.addEventListener('click', () => switchText(el.value));
    });
    const btn = document.querySelector('#submit') as HTMLButtonElement;
    btn.addEventListener("click", (event) => {
        const input: false | input = saveInput();
        if (input === false) {
            window.alert('Did not select which method to use.');
            event.preventDefault();
            return;
        };
        sendRequest(input);
        console.log(input);
        event.preventDefault();
    });
});

function switchText(database_text_change: string) {

    class input_field {
        public field: string;

        constructor(id: string) {
            this.field = id;
        };

        returnSelect() {
            return document.querySelector(`#${this.field}`) as HTMLLabelElement;
        };
    };

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

    const input_wrapper = document.querySelector('#inputs') as HTMLDivElement;
    input_wrapper.style.opacity = '1';
    input_wrapper.style.height = 'auto';
    const input = document.querySelector('#fourth-field') as HTMLInputElement;
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
    };
};

function saveInput() {
    let method_checked: string = '';
    const method: NodeListOf<HTMLInputElement> = (<NodeListOf<HTMLInputElement>>document.querySelectorAll('.method'));
    method.forEach(x => {
        if(x.checked === true)
            method_checked = x.value;
    });
    if (method_checked === ''){
       console.warn('Did not select which method use.');
       return false;
    };
    let database_checked: string = '';
    const database: NodeListOf<HTMLInputElement> = (<NodeListOf<HTMLInputElement>>document.querySelectorAll('.database'));
    database.forEach(x => {
        if(x.checked === true)
            database_checked = x.value;
    });
    if (database_checked === ''){
       console.warn('Did not select which database use.');
       return false;
    };
    const name: string = (<HTMLInputElement>document.querySelector("#first-field")).value;
    const surname: string = (<HTMLInputElement>document.querySelector("#second-field")).value;
    const age: number = Number((<HTMLInputElement>document.querySelector("#third-field")).value);
    const subjects: string[] = [(<HTMLInputElement>document.querySelector("#fourth-field")).value];
    return {method_checked, database_checked,name, surname, age, subjects};
};

async function sendRequest(data?: input, short_data?: short_input) {

    async function sendToServer(url: string) {
        const res = await fetch (url, {
            method: data?.method_checked || short_data?.method_checked,
            headers: {
                'Content-type': 'application/json; charset="utf-8"',
            },
            body: JSON.stringify({
                data: data || short_data,
            })
        });
        return res;
    };

    function deleteKeys() {
        for (const key in data) {
            if (data[key as keyof input] === '' || undefined || null)
                delete data[key as keyof input];
            if (typeof data[key as keyof input] === 'number' && data[key as keyof input] === 0)
                delete data[key as keyof input];
            if (key === 'subjects') {
                if (data.subjects?.length === 1 && data.subjects[0].length === 0)
                    delete data[key as keyof input];
            };
        };
    };
    
    function createQuery() {
        let query_URI: string = '';
        const query_data = { ...data };
        delete query_data.database_checked;
        delete query_data.method_checked;
        for (const key in query_data) {
            if (query_URI === '')
                query_URI = `${key}=${query_data[key as keyof input]}`;
            else 
                query_URI = `${query_URI}&${key}=${query_data[key as keyof input]}`
        };
        return query_URI;
    };

    if (data === undefined && short_data === undefined) {
        console.log('No data to send to server');
        return false;
    };
        
    let url = ``;
    let received_data = undefined;
    if (data === undefined && short_data !== undefined) {
        url = `${base_url}/${short_data.database_checked}?id=${short_data.id}`;
        const res = await sendToServer(url);
        received_data = await res.json();
        console.log(received_data);
    };

    if (data !== undefined && short_data === undefined) {
        deleteKeys();
        const query = createQuery();
        console.log(query);
        if (data.method_checked === 'DELETE' || data.method_checked === 'MODIFY' || data.method_checked === 'GET')
            url = `${base_url}/${data.database_checked}?${query}`;
        if (data.method_checked === 'POST')
            url = `${base_url}/${data.database_checked}`;
        const res = await sendToServer(url);
        received_data = await res.json();
        console.log(received_data);
    };

    if (received_data !== undefined) {
        displayResult(received_data, 'teachers');
    };
};

async function checkIfServerOnline() {
    const res = await fetch (base_url, {
        method: 'GET',
    });
    console.log(`${await res.text()}`);
}

function displayResult(returnedId: any, file: string) {
    //Displaying result
    type returnedData = {
        name: string,
        surname: string,
        age: number,
        subjects: Array<string>
    };

    async function getInfoFromDatabase(id: string) {
        const url = `${base_url}/Database/${file}?id=${id}`;
        const res = await fetch (url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        return await res.json();
    };

    function createList(data: returnedData, id: string) {
        const box = document.querySelector('#display-status') as HTMLDivElement;
        const list = document.createElement('ul');
        box.appendChild(list);
        list.setAttribute('id', `${id}`);
        list.setAttribute('class', 'search-result');
        for (const key in data) {
            const li_element = document.createElement('li');
            const p_element = document.createElement('p');
            const select_ul = document.getElementById(`${id}`) as HTMLUListElement;
            select_ul.insertAdjacentElement('beforeend', li_element);
            li_element.setAttribute('id', `${key}-${id}-li`);
            const select_li = document.getElementById(`${key}-${id}-li`) as HTMLLIElement;
            select_li.insertAdjacentElement('beforeend', p_element);
            p_element.setAttribute('id', `${key}-${id}-p`);
            const select_p = document.getElementById(`${key}-${id}-p`) as HTMLParagraphElement;
            select_p.textContent = String(data[key as keyof returnedData]);
        };
        list.addEventListener('click', (event) => {
            addFromListToInputs(event);
        });
    };

    function addFromListToInputs(event: any) {
        const id = event.composedPath()[2].id;
        const list = document.querySelector(`#${id}`) as HTMLUListElement;
        const inputs = document.querySelectorAll(`.write`) as NodeListOf<HTMLInputElement>;
        const li = list.childNodes as NodeListOf<HTMLLIElement>;
        inputs[0].value = li[0].innerText;
        inputs[1].value = li[1].innerText;
        inputs[2].value = li[2].innerText;
        try {
            inputs[3].value = li[3].innerText;
        } finally {};

    };

    const database: Array<returnedData> = [];
    returnedId.forEach(async (el: any) => {
        console.log(el.id);
        database.unshift(await getInfoFromDatabase(el.id));
        createList(database[0], el.id);
    });
};

console.log("Loaded client");

