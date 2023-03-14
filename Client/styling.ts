
window.addEventListener('DOMContentLoaded', () => {
    const input_wrapper = document.querySelectorAll('.input-wrapper') as NodeListOf<HTMLDivElement>;
    const button_radio = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    const btn_method: NodeListOf<HTMLInputElement> = document.querySelectorAll('.first-step') as NodeListOf<HTMLInputElement>;
    const btn_first_step = document.querySelector('#submit') as HTMLButtonElement;
    const add_method_button: HTMLButtonElement = document.querySelector('#method-add-button') as HTMLButtonElement;
    const btn_modify: HTMLInputElement = document.querySelector('#method-modify') as HTMLInputElement;
    const btn_delete: HTMLInputElement = document.querySelector('#method-delete') as HTMLInputElement;
    const display_status: HTMLDivElement = document.querySelector('#display-status') as HTMLDivElement;
    //Adding event listener to which database user chosen
    btn_method.forEach(el => {
        el.addEventListener('click', () => inputs(el.value, 'first'));
    });

    btn_modify.addEventListener('click', () => {
        btn_method.forEach(el => {
            if(el.checked === true)  
                inputs(el.value, 'second'); 
        });
    });

    btn_delete.addEventListener('click', () => {
        const modify_wrapper: HTMLDivElement = document.querySelector('#inputs-modify') as HTMLDivElement;
        modify_wrapper.classList.value = 'modify-unselect';
    });

    add_method_button.addEventListener('click', (event) => {
        const add_method_button_wrapper: HTMLDivElement = document.querySelector('#method-add-button-wrapper') as HTMLDivElement;
        add_method_button.classList.toggle('off');
        add_method_button.classList.toggle('on');
        add_method_button_wrapper.classList.toggle('wrapper-off');
        add_method_button_wrapper.classList.toggle('wrapper-on');
        add_method_button.className === 'on' ? btn_first_step.textContent = 'Dodaj' : btn_first_step.textContent = 'Szukaj';
        event.preventDefault();
    });



    for (let i = 0; i < input_wrapper.length; i++) {
        button_radio[i].addEventListener('click', (e) => {
            input_wrapper.forEach((wrapper: HTMLDivElement) => {
                if (wrapper.className === 'input-wrapper label-checked')
                    wrapper.classList.toggle('label-checked');
            });
            input_wrapper[i].classList.toggle('label-checked');
            e.stopPropagation();
        });
    };

    const observer = new MutationObserver(function(mutation) {
        mutation.forEach(change => {
            let ul: HTMLUListElement = change.addedNodes[0] as HTMLUListElement;
            const element = document.querySelector(`#${ul.id}`) as HTMLUListElement;
            element.addEventListener('click', () => {
                const ul_all = document.querySelectorAll('.search-result') as NodeListOf<HTMLUListElement>;
                ul_all.forEach(el => {
                    if (el.id !== ul.id) {
                        el.className = 'search-result';
                    };
                });
            });
        });
    });

    const config_display = {
        childList: true
    }

    observer.observe(display_status, config_display);
});

//Function switch text when user change databases
function inputs(database: string, step: string) {
    let inputs: HTMLDivElement;
    let modify_header: string;
    let last_char: string;
    let button: string;
    let modify: string;
    const text_database = {
        field: {
                char: {
                    last_char_search: '-field-label',
                    last_char_modify: '-field-modify-label',
                },
                mod: {
                    first: 'first',
                    second: 'second',
                    third: 'third',
                    fourth: 'fourth'
                }
        },
        teachers: {
            first_type: 'text',
            second_type: 'text',
            third_type: 'number',
            fourth_type: 'text',
            first_value: 'name',
            second_value: 'surname',
            third_value: 'age',
            fourth_value: 'subject',
            first_label: 'Imie',
            second_label: 'Nazwisko',
            third_label: 'Wiek',
            fourth_label: 'Przedmioty'
        },
        classrooms: {
            first_type: 'number',
            second_type: 'number',
            third_type: 'text',
            first_value: 'classroom',
            second_value: 'max_people',
            third_value: 'main_subject',
            first_label: 'Numer pokoju',
            second_label: 'Maksymalna ilość ludzi',
            third_label: 'Przedmioty w klasie'
        },
        subjects: {
            first_type: 'text',
            second_type: 'number',
            third_type: 'number',
            fourth_type: 'boolean',
            first_value: 'subject',
            second_value: 'classroom',
            third_value: 'lesson_hour',
            fourth_value: 'manadtory',
            first_label: 'Nazwa przedmiotu',
            second_label: 'W klasie nr',
            third_label: 'Ilość godzin lekcyjnych',
            fourth_label: 'Czy obowiązkowe'
        }
    };
    if (step === 'first') {
        inputs = document.getElementById('inputs') as HTMLDivElement;
        inputs.className = 'inputs-select';
        last_char = text_database.field.char.last_char_search as string;
        modify_header = '';
        button = '<button id="submit">Szukaj</button>';
        modify = '';
    }
    else  {
        inputs = document.getElementById('inputs-modify') as HTMLDivElement;
        inputs.className = 'modify-select';
        last_char = text_database.field.char.last_char_modify as string;
        modify_header = '<h3>Wybierz które dane chcesz zaktualizować</h3>';
        button = '<button id="submit-to-server">Finalizuj</button>';
        modify = '-modify';
    };
    switch (database) {
        case 'teachers': {
            let {first, second, third, fourth} = text_database.field.mod
            const {first_type, second_type, third_type, fourth_type, first_value, second_value, third_value, fourth_value, first_label, second_label, third_label, fourth_label} = text_database.teachers;
            inputs.innerHTML = 
            `${modify_header}
            <label id="${first}${last_char}" for="first-modify-field" value="${first_value}">${first_label}</label>
            <input type="${first_type}" class="input write" id="first-modify-field" name="first-field">
            <label id="${second}${last_char}" for="second-modify-field" value="${second_value}">${second_label}</label>
            <input type="${second_type}" class="input write" id="second-modify-field" name="second-field">
            <label id="${third}${last_char}" for="third-modify-field" value="${third_value}">${third_label}</label>
            <input type="${third_type}" class="input write" id="third-modify-field" name="third-field">
            <label id="${fourth}${last_char}" for="fourth-modify-field" value="${fourth_value}">${fourth_label}</label>
            <input type="${fourth_type}" class="input write" id="fourth-modify-field" name="fourth-field">
            ${button}`;
            break;
        }
        case 'classrooms': {
            const {first_type, second_type, third_type, first_value, second_value, third_value, first_label, second_label, third_label} = text_database.classrooms;
            inputs.innerHTML = 
            `${modify_header}
            <label id="first-field-modify-label" for="first-modify-field" value="${first_value}">${first_label}</label>
            <input type="${first_type}" class="input write" id="first-modify-field" name="first-field">
            <label id="second-field-modify-label" for="second-modify-field" value="${second_value}">${second_label}</label>
            <input type="${second_type}" class="input write" id="second-modify-field" name="second-field">
            <label id="third-field-modify-label" for="third-modify-field" value="${third_value}">${third_label}</label>
            <input type="${third_type}" class="input write" id="third-modify-field" name="third-field">
            ${button}`
            break;
        }
        case 'subjects': {
            const {first_type, second_type, third_type, fourth_type, first_value, second_value, third_value, fourth_value, first_label, second_label, third_label, fourth_label} = text_database.subjects;
            inputs.innerHTML = 
            `${modify_header}
            <label id="first-field-modify-label" for="first-modify-field" value="${first_value}">${first_label}</label>
            <input type="${first_type}" class="input write" id="first-modify-field" name="first-field">
            <label id="second-field-modify-label" for="second-modify-field" value="${second_value}">${second_label}</label>
            <input type="${second_type}" class="input write" id="second-modify-field" name="second-field">
            <label id="third-field-modify-label" for="third-modify-field" value="${third_value}">${third_label}</label>
            <input type="${third_type}" class="input write" id="third-modify-field" name="third-field">
            <label id="fourth-field-modify-label" for="fourth-modify-field" value="${fourth_value}">${fourth_label}</label>
            <div id="mandatory-wrapper${modify}" class="visible">
                <p>Nie</p>
                <div id = "mandatory-button-wrapper${modify}" class="wrapper-off">
                    <button type="button" id="mandatory-button${modify}" class="off"></button>
                </div>
                <p>Tak</p>
            </div>
            ${button}`;
            if (step === 'first') {
                const mandatory_button: HTMLButtonElement = document.querySelector('#mandatory-button') as HTMLButtonElement;
                mandatory_button.addEventListener('click', (event) => {
                    const mandatory_button_wrapper: HTMLDivElement = document.querySelector('#mandatory-button-wrapper') as HTMLDivElement;
                    mandatory_button.classList.toggle('off');
                    mandatory_button.classList.toggle('on');
                    mandatory_button_wrapper.classList.toggle('wrapper-off');
                    mandatory_button_wrapper.classList.toggle('wrapper-on');
                    event.preventDefault();
                });
            }
            else {
                const mandatory_button_modify: HTMLButtonElement = document.querySelector('#mandatory-button-modify') as HTMLButtonElement;
                mandatory_button_modify.addEventListener('click', (event) => {
                    const mandatory_button_wrapper_modify: HTMLDivElement = document.querySelector('#mandatory-button-wrapper-modify') as HTMLDivElement;
                    mandatory_button_modify.classList.toggle('off');
                    mandatory_button_modify.classList.toggle('on');
                    mandatory_button_wrapper_modify.classList.toggle('wrapper-off');
                    mandatory_button_wrapper_modify.classList.toggle('wrapper-on');
                    event.preventDefault();
                }); 
            };
            break;
        };
    };
};

console.log('Styling loaded');