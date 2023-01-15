const base_url = 'http://localhost:5500';

type input = {
    database_checked?: string | undefined,
    method_checked?: string | undefined,
    name: string,
    surname: string,
    age: number,
    subjects: string[]
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
    const btn_method: NodeListOf<HTMLInputElement> = document.querySelectorAll('.database') as NodeListOf<HTMLInputElement>;
    btn_method.forEach(el => {
        el.addEventListener('click', () => switchText(el.value));
    });

    const btn_user = document.querySelector('#submit') as HTMLButtonElement;
    btn_user.addEventListener("click", (event) => {
        let progress: string = 'user';
        let database_temp: string = '';
        let input = Input(progress, false) as input | boolean;
         
        Input(progress, true);
        if (input === false) {
            window.alert('Did not select which method to use.');
            event.preventDefault();
            return;
        };
        if (typeof input !== 'boolean') {
            if (input.database_checked)
                database_temp = input.database_checked;
            const dataResponce = async () => { 
                let data_server: Object = await getDataFromServer(input as input);
                if (typeof data_server === 'string' && data_server.length === 0) {
                    window.alert('Server returned answer without matching result');
                    return false;
                };
                return data_server
            };
            console.log(input);
            dataResponce();
        };

        const btn_server = document.querySelector('#submit-to-server') as HTMLButtonElement;
        btn_server.addEventListener("click", () => {
            progress = 'server';
            input = Input(progress, false) as input | boolean;
            if (typeof input !== 'boolean') {
                input.database_checked = database_temp;
                getDataFromServer(input);
            };
        });

        event.preventDefault();
    });
});

function Input(progress: string, clear_input: boolean) {

    if (clear_input === true) {
        const name = document.querySelector("#first-field") as HTMLInputElement;
        const surname = document.querySelector("#second-field") as HTMLInputElement;
        const age = document.querySelector("#third-field") as HTMLInputElement;
        const subjects = document.querySelector("#fourth-field") as HTMLInputElement;
        name.innerText = '';
        surname.innerText = '';
        age.innerText = '';
        subjects.innerText = '';
        return true;
    }

    if (progress === 'user') {
        let database_checked: string = '';
        const database: NodeListOf<HTMLInputElement> = (<NodeListOf<HTMLInputElement>>document.querySelectorAll('.database'));
        database.forEach(x => {
            if(x.checked === true)
            database_checked = x.value;
        });
        if (database_checked === ''){
            console.warn('Did not select which method use.');
            return false;
        };
        const name: string = (<HTMLInputElement>document.querySelector("#first-field")).value;
        const surname: string = (<HTMLInputElement>document.querySelector("#second-field")).value;
        const age: number = Number((<HTMLInputElement>document.querySelector("#third-field")).value);
        const subjects: string[] = [(<HTMLInputElement>document.querySelector("#fourth-field")).value];
        return {database_checked, name, surname, age, subjects};
    };

    if (progress === 'server') {
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
        const name: string = (<HTMLInputElement>document.querySelector("#first-field")).value;
        const surname: string = (<HTMLInputElement>document.querySelector("#second-field")).value;
        const age: number = Number((<HTMLInputElement>document.querySelector("#third-field")).value);
        const subjects: string[] = [(<HTMLInputElement>document.querySelector("#fourth-field")).value];
        return {method_checked, name, surname, age, subjects};
    };

    return false;
};

function switchText(method_text_change: string) {

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
    };
};

async function getDataFromServer(data_user: input) {

    type returnedData = {
        data: Object,
        id: string
    };

    async function sendToServerGet(url: string) {
        const res = await fetch (url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset="utf-8"',
                }
            });
        return res;
    };

    async function sendToServer(url: string) {
        const res = await fetch (url, {
            method: data_user.method_checked,
            headers: {
                'Content-type': 'application/json; charset="utf-8"',
                },
            body: JSON.stringify(data_user)
        });
        return res;
    };

    function deleteKeys() {
        for (const key in data_user) {
            if (data_user[key as keyof input] === '' || undefined || null)
                delete data_user[key as keyof input];
            if (typeof data_user[key as keyof input] === 'number' && data_user[key as keyof input] === 0)
                delete data_user[key as keyof input];
            if (key === 'subjects') {
                if (data_user.subjects?.length === 1 && data_user.subjects[0].length === 0)
                    delete data_user[key as keyof input];
            };
        };
    };
    
    function createQuery() {
        let query_URI: string = '';
        const query_data: input = { ...data_user };
        delete query_data.database_checked;
        for (const key in query_data) {
            if (query_URI === '')
                query_URI = `${key}=${query_data[key as keyof input]}`;
            else 
                query_URI = `${query_URI}&${key}=${query_data[key as keyof input]}`
        };
        return query_URI;
    };

    let url: string = '';
    deleteKeys();
    if (data_user.method_checked === undefined) {
        url = `${base_url}/${data_user.database_checked}?${createQuery()}`;
        const res = await sendToServerGet(url);
        const return_data: returnedData[] = await res.json();
        return_data.forEach(el => {
            displayResult(el.data, el.id);
        });
        return return_data;
    }
    else {
        url = `${base_url}/${data_user.database_checked}`;
        const res = await sendToServer(url);
        const return_data: returnedData[] = await res.json();
        return_data.forEach(el => {
            displayResult(el.data, el.id);
        });
        return return_data;
    };
};

async function checkIfServerOnline() {
    const res = await fetch (base_url, {
        method: 'GET',
    });
    console.log(`${await res.text()}`);
}

function displayResult(data: any, id: string) {
    //Displaying result
    type returnedData = {
        name: string,
        surname: string,
        age: number,
        subjects: Array<string>
    };

    function createList(data: returnedData, id: string) {
        const user_input = document.querySelector('#user-data') as HTMLFormElement;
        user_input.setAttribute('style', 'display: none');
        const server_input = document.querySelector('#server-data') as HTMLFormElement;
        server_input.setAttribute('style', '');
        const display_status_box = document.querySelector('#display-status') as HTMLDivElement;
        const list = document.createElement('ul');
        display_status_box.appendChild(list);
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
            list.classList.toggle('search-result-green');
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

    createList(data, id);

};

console.log("Loaded client");

