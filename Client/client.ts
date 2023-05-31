const base_url = 'http://localhost:5500';

//Check where lesson and classroom in Subjects are
//Return button
//Change CSS height depending on database selected

interface teachersData {
    name: string,
    surname: string,
    age: number,
    subjects: Array<string>
};

interface classroomsData {
    classroom: number,
    max_people: number,
    main_subject: string
};

interface subjectsData {
    lesson: string,
    classroom: number,
    lesson_hours: number,
    mandatory: boolean,
};

type returnData = teachersData | classroomsData | subjectsData;

interface serverReponse {
    msg: string,
    code: number,
    data?: Array<Object> | Object;
};

class ServerData {
    msg: string;
    code: number;
    data?: Array<Object> | Object;

    constructor(serverResponse: serverReponse) {
        if (serverResponse.data !== undefined){
            this.msg = serverResponse.msg;
            this.code = Number(serverResponse.code);
            this.data = serverResponse.data;
        }
        else {
            this.msg = serverResponse.msg;
            this.code = Number(serverResponse.code);
        };
    };
};

class InputClass {
    name?: string;
    surname?: string;
    age?: number;
    subject?: string;
    classroom?: number;
    max_people?: number;
    lesson?: string;
    main_subject?: string;
    lesson_hour?: number;
    mandatory?: boolean;
    database?: string;
    method?: string;
    type?: string;

    constructor() {
        this.checkDatabase();
        const mandatory_button: HTMLButtonElement = document.querySelector('#mandatory-button') as HTMLButtonElement;
        switch(this.database) {
            case 'teachers': {
                this.name = (<HTMLInputElement>document.querySelector("#first-field")).value;
                this.surname = (<HTMLInputElement>document.querySelector("#second-field")).value;
                this.age = Number((<HTMLInputElement>document.querySelector("#third-field")).value);
                this.subject = (<HTMLInputElement>document.querySelector("#fourth-field")).value === '' ? '' : `[${(<HTMLInputElement>document.querySelector("#fourth-field")).value}]`;
                this.type = 'input_teachers';
                this.deleteKeys();
                break;
            };

            case 'classrooms': {
                this.classroom = Number((<HTMLInputElement>document.querySelector("#first-field")).value);
                this.max_people = Number((<HTMLInputElement>document.querySelector("#second-field")).value);
                this.main_subject = (<HTMLInputElement>document.querySelector("#third-field")).value;
                this.type = 'input_classrooms';
                this.deleteKeys();
                break;
            };

            case 'subjects': {
                this.lesson = (<HTMLInputElement>document.querySelector("#first-field")).value;
                this.classroom = Number((<HTMLInputElement>document.querySelector("#first-field")).value);
                this.lesson_hour = Number((<HTMLInputElement>document.querySelector("#second-field")).value);
                this.type = 'input_subjects';
                if (mandatory_button.className === 'on')
                    this.mandatory = true;
                else
                    this.mandatory = false;
                this.deleteKeys();
                break;
            };
        };
    };

    checkDatabase() {
        const database: NodeListOf<HTMLInputElement> = document.querySelectorAll('.database') as NodeListOf<HTMLInputElement>;
        database.forEach(x => {
            if(x.checked === true)
                this.database = x.value;
        });
    };

    checkMethod() {
        const post_method: HTMLButtonElement = document.querySelector('#method-add-button') as HTMLButtonElement;
        if (post_method.className === 'on')
            this.method = 'POST'
        else {
            const method: NodeListOf<HTMLInputElement> = (<NodeListOf<HTMLInputElement>>document.querySelectorAll('.method'));
            method.forEach(x => {
                if(x.checked === true)
                    this.method = x.value;
                }); 
        };
    };

    deleteKeys() {
        if (this.name === undefined || this.name === '') delete this.name;
        if (this.surname === undefined || this.surname === '') delete this.surname;
        if (this.age === undefined || Number.isNaN(this.age) || this.age === 0) delete this.age;
        if (this.subject === undefined || this.subject === '') delete this.subject;
        if (this.classroom === undefined || Number.isNaN(this.classroom)) delete this.classroom;
        if (this.max_people === undefined || Number.isNaN(this.max_people)) delete this.max_people;
        if (this.main_subject === undefined || this.main_subject === '') delete this.main_subject;
        if (this.lesson_hour === undefined || Number.isNaN(this.lesson_hour)) delete this.lesson_hour;
        if (this.mandatory === undefined) delete this.mandatory;
        if (this.lesson === undefined || this.lesson === '') delete this.lesson;
    };

    modifyMethod() {
        switch(this.database) {
            case 'teachers': {
                this.name = (<HTMLInputElement>document.querySelector("#first-modify-field")).value;
                this.surname = (<HTMLInputElement>document.querySelector("#second-modify-field")).value;
                this.age = Number((<HTMLInputElement>document.querySelector("#third-modify-field")).value);
                this.subject = (<HTMLInputElement>document.querySelector("#fourth-modify-field")).value;
                break;
            };

            case 'classrooms': {
                this.classroom = Number((<HTMLInputElement>document.querySelector("#first-modify-field")).value);
                this.max_people = Number((<HTMLInputElement>document.querySelector("#second-modify-field")).value);
                this.main_subject = (<HTMLInputElement>document.querySelector("#third-modify-field")).value;
                break;
            };

            case 'subjects': {
                const mandatory_button_modify: HTMLButtonElement =  document.querySelector('#mandatory-button-modify') as HTMLButtonElement;
                this.lesson = (<HTMLInputElement>document.querySelector("#first-modify-field")).value;
                this.classroom = Number((<HTMLInputElement>document.querySelector("#second-modify-field")).value);
                this.lesson_hour = Number((<HTMLInputElement>document.querySelector("#third-modify-field")).value);
                if (mandatory_button_modify.className === 'on')
                    this.mandatory = true;
                else
                    this.mandatory = false;
                this.deleteKeys();
                break;
            };
        };
    };
};

const database: NodeListOf<HTMLDivElement> = document.querySelectorAll('.input-wrapper');
database.forEach(el => el.addEventListener('click', () => detectStart()));

function detectStart() {
    console.log('Checking connection with server...');

    const btn_user = document.querySelector('#submit') as HTMLButtonElement;
    //Checking if server is online or offline
    checkServerStatus().then(x => {     
        if (x === true)
            console.log('Server connected');
        else 
            console.error('Could not connect to server');
    });
    //if (btn_user === null) return;

    //Adding event listener to button with id submit
    btn_user?.addEventListener("click", (event_client) => {
        let database_temp: string = '';
        const inputs_validation: NodeListOf<HTMLInputElement> = document.querySelectorAll('#inputs .write') as NodeListOf<HTMLInputElement>;
        let validate: boolean;
        //Function returning data from server or string with error message
        const dataResponce = async (first: InputClass, second?: InputClass) => { 
            typeof second !== 'undefined'? await getDataFromServer(first, second) : await getDataFromServer(first);
        };

        //Checking if in validation every input is properly written
        inputs_validation.forEach(el => {
            if(!(el.placeholder) === false) {
                validate = false;
            }
        });

        if (validate! === false) return;

        //Saving data which user input
        let input: InputClass = new InputClass;
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
        };

        //This menu only shows when user did not select add method.
        const btn_server = document.querySelector('#submit-to-server') as HTMLButtonElement;
        btn_server.addEventListener("click", (event_server) => {
            
            //We cleared all inputs before and need to send whole input type data.
            if (typeof input !== 'boolean')
                database_temp = input.database as string;
            input = new InputClass;
            if (typeof input !== 'boolean') {
                input.database = database_temp;
                input.checkMethod();
                const input_modify: InputClass = new InputClass;
                input_modify.modifyMethod();
                input_modify.deleteKeys();
                inputClear();
                input.method === 'PUT' ? dataResponce(input, input_modify) : dataResponce(input);
            };
            event_server.preventDefault();
        });
        event_client.preventDefault();
    });
}


//Function clear user inputs
function inputClear() {
    (<HTMLInputElement>document.querySelector("#first-field")).value = '';
    (<HTMLInputElement>document.querySelector("#second-field")).value = '';
    (<HTMLInputElement>document.querySelector("#third-field")).value = '';
    if (document.querySelector("#fourth-field") !== null)
        (<HTMLInputElement>document.querySelector("#fourth-field")).value = '';
    return true;
};

//Function sending data to server as query or user data
//'data_to_send' - only accepts data with type InputClass
//'data_to_modify' - only exist when we choose 'PUT' method with the type of InputClass
async function getDataFromServer(data_to_send: InputClass, data_to_modify?: InputClass) {

    delete data_to_send.type;

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

    //Function for 'POST', 'DELETE', 'PUT'
    //'url' - uses as short url to show which database we want to use
    //In body we pass 'data_to_send' with data inserted by user
    async function sendToServer(url: string, data: object) {
        const method_check = data_to_send.method;
        delete data_to_send.method;
        delete data_to_send.database;
        const res = await fetch (url, {
            method: method_check,
            headers: {
                'Content-type': 'application/json; charset="utf-8"',
                },
            body: JSON.stringify(data),
        });
        return res;
    };

    //Function delete unused keys.
    function deleteKeys() {
        for (const key in data_to_send) {
            if (data_to_send[key as keyof InputClass] === '' || undefined || null)
                delete data_to_send[key as keyof InputClass];
            if (typeof data_to_send[key as keyof InputClass] === 'number' && data_to_send[key as keyof InputClass] === 0)
                delete data_to_send[key as keyof InputClass];
            if (key === 'subject') {
                if (data_to_send.subject === undefined && !(data_to_send.type === 'input_classrooms'))
                    delete data_to_send[key as keyof InputClass];
            };
        };
    };
    
    //Function creates query for 'GET' method
    function createQuery() {
        let query_URI: string = '';
        const query_data = { ...data_to_send } as InputClass;
        delete query_data.database;
        for (const key in query_data) {
            if (query_URI === '')
                query_URI = `${key}=${query_data[key as keyof InputClass]}`;
            else 
                query_URI = `${query_URI}&${key}=${query_data[key as keyof InputClass]}`
        };
        return query_URI;
    };

    let url: string = '';
    deleteKeys();

    //If 'method_check' is not present function first check if data is not present in databases
    //If it returns data function will display it for easier use.
    //If 'method_check' is present it means that we want to do a specific task to proceed
    if (data_to_send.method === undefined) {
        url = `${base_url}/${data_to_send.database}?${createQuery()}`;
        const res = await sendToServerGet(url);
        const return_data: serverReponse = new ServerData(await res.json());
        if (return_data.code === 0o0013){
            displayMessage(return_data.msg, 'server_response');
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
        const res = await sendToServer(url, {data_to_send, data_to_modify});
        const return_data: serverReponse = new ServerData(await res.json());
        switch (return_data.code) {
            case 0o0001:
                displayMessage(return_data.msg, 'server_response');
                break;

            case 0o0002:
                displayMessage(return_data.msg, 'server_response');
                break;

            case 0o0011:
                displayMessage(return_data.msg, 'server_response');
                break;

            case 0o0101:
                displayMessage(return_data.msg, 'server_response');
                break;

            default:
                console.log('Something went wrong.');
                console.log(return_data);
                break;
        };
    };
};

//Simply synchronus function to check if server is online or offline
function checkServerStatus() {
    const res = fetch (`${base_url}/server_status`, 
    {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset="utf-8"',
       }
    });

    return res.then (response => {
        console.log(response.status);
        if(response.status === 200) {
            return true;
        } else 
            return false;
    }).catch (error => {
        console.error(`This is error: ${error}`);
        return false;
    });
}

//Function for displaying second step menus
function displayResult(data: returnData, id: string, method?: string) {

    //If sent data for 'POST' method returns data from the server with similar data inserted by the user
    //On client side will appear simple menu for confirmation to realize his request even if the data is similar
    if (method === 'POST') {
        const force_post: HTMLFormElement = document.querySelector('#force-post') as HTMLFormElement;
        force_post.setAttribute('style', '');
    };

    //Function create list with id and data returned by server
    function createList(data: returnData, id: string) {
        const user_input = document.querySelector('#first-step') as HTMLFormElement;
        user_input.setAttribute('style', 'display: none');
        const server_input = document.querySelector('#second-step') as HTMLFormElement;
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
            li_element.setAttribute('class', key);
            const select_li = document.getElementById(`${key}-${id}-li`) as HTMLLIElement;
            select_li.insertAdjacentElement('beforeend', p_element);
            p_element.setAttribute('id', `${key}-${id}-p`);
            const select_p = document.getElementById(`${key}-${id}-p`) as HTMLParagraphElement;
            select_p.textContent = String(data[key as keyof returnData]);
        };
        list.addEventListener('click', (event: any) => {
            inputClear();
            addFromListToInputs(event);
            list.classList.toggle('search-result-green');
        });
    };

    //Function inserts data from lists to hidden inputs which we can later use
    function addFromListToInputs(event: any) {
        const id = event.composedPath()[2].id === '' ? event.composedPath()[0].id : event.composedPath()[2].id;
        console.log(id);
        const list = document.querySelector(`#${id}`) as HTMLUListElement;
        const inputs = document.querySelectorAll(`#inputs > .write`) as NodeListOf<HTMLInputElement>;
        const li = list.childNodes as NodeListOf<HTMLLIElement>;
        li.forEach(el_li => {
            inputs.forEach(el_inputs => {
                if(el_li.className === el_inputs.attributes.getNamedItem('for-attr')?.value)
                    el_inputs.value = el_li.innerText;
            });
        });

    };

    createList(data, id);

};

function displayMessage(msg: string, from: string){
    const p_element = document.createElement('p');
    const select_div = document.querySelector('#display-status') as HTMLDivElement;
    select_div.innerHTML = '';
    select_div.insertAdjacentElement('beforeend', p_element);
    p_element.textContent = msg;
    p_element.className = from;
};

console.log("Loaded client");

