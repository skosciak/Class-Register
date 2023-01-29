const base_url = 'http://localhost:5500';

/*
    To do: 
        - Switch border when selected input
*/

type input = {
    database_check?: string,
    method_check?: string | undefined,
    name: string,
    surname: string,
    age: number,
    subjects: string[]
};

type short_input = {
    id: string,
    database_check: string,
    method_check: string,
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
    console.log('Checking connection with server...');
    //Checking if server is online or offline
    checkServerStatus().then(x => {     
        if (x === true)
            console.log('Server connected');
        else 
            console.error('Could not connect to server');
    });

    //Adding event listener to which database user chosen
    const btn_method: NodeListOf<HTMLInputElement> = document.querySelectorAll('.first-step') as NodeListOf<HTMLInputElement>;
    btn_method.forEach(el => {
        el.addEventListener('click', () => switchText(el.value));
    });

    const add_method_button: HTMLButtonElement = document.querySelector('#method-add-button') as HTMLButtonElement;
    add_method_button.addEventListener('click', (event) => {
        const add_method_button_wrapper: HTMLDivElement = document.querySelector('#method-add-button-wrapper') as HTMLDivElement;
        add_method_button.classList.toggle('add-off');
        add_method_button.classList.toggle('add-on');
        add_method_button_wrapper.classList.toggle('add-wrapper-off');
        add_method_button_wrapper.classList.toggle('add-wrapper-on');
        event.preventDefault();
    });

    //Adding event listener to button with id submit
    const btn_user = document.querySelector('#submit') as HTMLButtonElement;
    btn_user.addEventListener("click", (event) => {
        let progress: string = 'user';
        let database_temp: string = '';

        //Saving data which user input
        let input = Input(progress, false) as input | boolean;

        //Clearing data in inputs for either choosing different data or staying clear
        Input(progress, true);

        //If the user did not select database input returned a boolean value
        if (input === false) {
            window.alert('Did not select database.');
            event.preventDefault();
            return;
        };

        //If type is not boolean function start working with data
        if (typeof input !== 'boolean') {

            //Function returning data from server or string with error message
            const dataResponce = async () => { 
                let data_server: Object | string = await getDataFromServer(input as input);
                if (typeof data_server === 'string' && typeof input !== "boolean") {
                    console.warn(data_server);
                    return false;
                };
                return data_server
            };
            console.log(input);
            dataResponce();
        };
        
        //This menu only shows when user did not select add method.
        const btn_server = document.querySelector('#submit-to-server') as HTMLButtonElement;
        btn_server.addEventListener("click", () => {
            progress = 'server';
            
            //We cleared all inputs before and need to send whole input type data.
            if (typeof input !== 'boolean')
                database_temp = input.database_check as string;
            input = Input(progress, false) as input | boolean;
            if (typeof input !== 'boolean') {
                input.database_check = database_temp;
                getDataFromServer(input);
            };
        });

        event.preventDefault();
    });
});


//Function save user input and have 3 options.
//'progress' which can be 'user' or 'server'
//'user' - needs to select at least one database and choose if he wants to add data inserted later
//'server' - only select left methods remove, modify or search
//'clear_input' - to clear inputss
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
        let database_check: string = '';
        const post_method: HTMLInputElement = document.querySelector('#method-add-button') as HTMLInputElement;
        const database: NodeListOf<HTMLInputElement> = document.querySelectorAll('.database') as NodeListOf<HTMLInputElement>;
        database.forEach(x => {
            if(x.checked === true)
            database_check = x.value;
        });
        if (database_check === ''){
            console.warn('Did not select which database use.');
            return false;
        };

        const name: string = (<HTMLInputElement>document.querySelector("#first-field")).value;
        const surname: string = (<HTMLInputElement>document.querySelector("#second-field")).value;
        const age: number = Number((<HTMLInputElement>document.querySelector("#third-field")).value);
        const subjects: string[] = [(<HTMLInputElement>document.querySelector("#fourth-field")).value];
        const method_check: string = post_method.value;

        if (post_method.className === 'add-on')
            return {database_check, name, surname, age, subjects, method_check};
        else
            return {database_check, name, surname, age, subjects}
    };

    if (progress === 'server') {
        let method_check: string = '';
        const method: NodeListOf<HTMLInputElement> = (<NodeListOf<HTMLInputElement>>document.querySelectorAll('.method'));
        method.forEach(x => {
            if(x.checked === true)
                method_check = x.value;
        });
        if (method_check === ''){
            console.warn('Did not select which method use.');
            return false;
        };
        const name: string = (<HTMLInputElement>document.querySelector("#first-field")).value;
        const surname: string = (<HTMLInputElement>document.querySelector("#second-field")).value;
        const age: number = Number((<HTMLInputElement>document.querySelector("#third-field")).value);
        const subjects: string[] = [(<HTMLInputElement>document.querySelector("#fourth-field")).value];
        return {method_check, name, surname, age, subjects};
    };

    return false;
};

//Function switch text when user change databases
function switchText(method_text_change: string) {

    class input_field {
        public field: string;

        constructor(id: string) {
            this.field = id;
        };

        returnLabel() {
            return document.querySelector(`#${this.field}`) as HTMLLabelElement;
        };

        returnInput() {
            return document.querySelector(`#${this.field}`) as HTMLInputElement;
        };
    };

    const field = {
        label: {
            first: new input_field('first-field-label').returnLabel(),
            second: new input_field('second-field-label').returnLabel(),
            third: new input_field('third-field-label').returnLabel(),
            fourth: new input_field('fourth-field-label').returnLabel()
        },
        input: {
            first: new input_field('first-field').returnInput(),
            second: new input_field('second-field').returnInput(),
            third: new input_field('third-field').returnInput(),
            fourth: new input_field('fourth-field').returnInput()
        }
    };

    const input_wrapper = document.querySelector('#inputs') as HTMLDivElement;
    input_wrapper.style.opacity = '1';
    input_wrapper.style.height = 'auto';
    switch (method_text_change) {
        case 'classroom':
            field.label.first.innerText = text_object.classroom.classroom;
            field.label.first.setAttribute('value', 'classroom');
            field.input.first.setAttribute('type', 'number');
            field.label.second.innerText = text_object.classroom.max_people;
            field.label.second.setAttribute('value', 'max-people');
            field.input.second.setAttribute('type', 'number');
            field.label.third.innerText = text_object.classroom.main_subjects;
            field.label.third.setAttribute('value', 'main-subjects');
            field.input.third.setAttribute('type', 'text');
            field.label.fourth.style.display = 'none';
            field.input.fourth.style.display = 'none';
            break;

        case 'teachers':
            field.label.first.innerText = text_object.teachers.name;
            field.label.first.setAttribute('value', 'name');
            field.input.first.setAttribute('type', 'text');
            field.label.second.innerText = text_object.teachers.surname;
            field.label.second.setAttribute('value', 'surname');
            field.input.second.setAttribute('type', 'text');
            field.label.third.innerText = text_object.teachers.age;
            field.label.third.setAttribute('value', 'age');
            field.input.third.setAttribute('type', 'number');
            field.label.fourth.innerText = text_object.teachers.subjects;
            field.label.fourth.setAttribute('value', 'subjects');
            field.input.fourth.setAttribute('type', 'text');
            field.label.fourth.style.display = 'block';
            field.input.fourth.style.display = 'block';
            break;

        case 'subjects':
            field.label.first.innerText = text_object.subjects.subject;
            field.label.first.setAttribute('value', 'subject');
            field.input.first.setAttribute('type', 'text');
            field.label.second.innerText = text_object.subjects.classroom;
            field.label.second.setAttribute('value', 'classroom');
            field.input.second.setAttribute('type', 'number');
            field.label.third.innerText = text_object.subjects.lessons_hours;
            field.label.third.setAttribute('value', 'lessons_hours');
            field.input.third.setAttribute('type', 'number');
            field.label.fourth.innerText = text_object.subjects.mandatory;
            field.label.fourth.setAttribute('value', 'mandatory');
            field.input.fourth.setAttribute('type', 'text');
            field.label.fourth.style.display = 'block';
            field.input.fourth.style.display = 'block';
            break;

        default:
            break;
    };
};

//Function sending data to server as query or user data
//'data_user' - only accepts data with type input
async function getDataFromServer(data_user: input) {

    type returnedData = {
        data: Object,
        id: string
    };

    //Function only for 'GET' method
    //'url' - 'GET' method only send data in form of query
    async function sendToServerGet(url: string) {
        const res = await fetch (url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset="utf-8"',
                }
            });
        return res;
    };

    //Function for 'POST', 'DELETE', 'PATCH'
    //'url' - uses as short url to show which database we want to use
    //In body we pass 'data_user' with data inserted by user
    async function sendToServer(url: string) {
        const res = await fetch (url, {
            method: data_user.method_check,
            headers: {
                'Content-type': 'application/json; charset="utf-8"',
                },
            body: JSON.stringify(data_user)
        });
        return res;
    };

    //Function delete unused keys.
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
    
    //Function creates query for 'GET' method
    function createQuery() {
        let query_URI: string = '';
        const query_data: input = { ...data_user };
        delete query_data.database_check;
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

    //If 'method_check' is not present function first check if data is not present in databases
    //If it returns data function will display it for easier use.
    //If 'method_check' is present it means that we want to do a specific task to proceed
    if (data_user.method_check === undefined) {
        url = `${base_url}/${data_user.database_check}?${createQuery()}`;
        const res = await sendToServerGet(url);
        const return_data: returnedData[] = await res.json();
        if (typeof return_data === 'string'){
            displayMessage(return_data);
            return return_data;
        }
        return_data.forEach(el => {
            displayResult(el.data, el.id);
        });
        return return_data;
    }
    else {
        url = `${base_url}/${data_user.database_check}`;
        const res = await sendToServer(url);
        const return_data: returnedData[] = await res.json();
        if (typeof return_data === 'string') {
            console.warn('Cannot add new teacher. Name, surname and at least one subject is mandatory!!!');
            return return_data;
        }
        else {
            return_data.forEach(el => {
                displayResult(el.data, el.id, data_user.method_check);
            });
            return return_data;
        };
    };
};

//Simply synchronus function to check if server is online or offline
function checkServerStatus() {
    let return_response: boolean;
    const res = fetch (`${base_url}/server_status`, 
    {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset="utf-8"',
       }
    });

    return res.then (res => {
        console.log(res.status);
        if(res.status === 200) {
            return true;
        } else 
            return false;
    }).catch (error => {
        console.error(`This is error: ${error}`);
        return false;
    });
}

//Function for displaying second step menus
function displayResult(data: any, id: string, method?: string) {
    //Displaying result
    type returnedData = {
        name: string,
        surname: string,
        age: number,
        subjects: Array<string>
    };

    //If sent data for 'POST' method returns data from the server with similar data inserted by the user
    //On client side will appear simple menu for confirmation to realize his request even if the data is similar
    if (method === 'POST') {
        const force_post: HTMLFormElement = document.querySelector('#force-post') as HTMLFormElement;
        force_post.setAttribute('style', '');
    };

    //Function create list with id and data returned by server
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

    //Function inserts data from lists to hidden inputs which we can later use
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

function displayMessage(msg: string){
    const p_element = document.createElement('p');
    const select_div = document.querySelector('#display-status') as HTMLDivElement;
    select_div.insertAdjacentElement('beforeend', p_element);
    p_element.textContent = msg;
};

console.log("Loaded client");

