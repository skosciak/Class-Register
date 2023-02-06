
window.addEventListener('DOMContentLoaded', () => {
    const input_wrapper = document.querySelectorAll('.input-wrapper') as NodeListOf<HTMLDivElement>;
    const button_radio = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    const btn_method: NodeListOf<HTMLInputElement> = document.querySelectorAll('.first-step') as NodeListOf<HTMLInputElement>;
    const btn_first_step = document.querySelector('#submit') as HTMLButtonElement;
    const add_method_button: HTMLButtonElement = document.querySelector('#method-add-button') as HTMLButtonElement;
    
    

    //Adding event listener to which database user chosen
    btn_method.forEach(el => {
        el.addEventListener('click', () => switchText(el.value));
    });

    add_method_button.addEventListener('click', (event) => {
        const add_method_button_wrapper: HTMLDivElement = document.querySelector('#method-add-button-wrapper') as HTMLDivElement;
        add_method_button.classList.toggle('add-off');
        add_method_button.classList.toggle('add-on');
        add_method_button_wrapper.classList.toggle('add-wrapper-off');
        add_method_button_wrapper.classList.toggle('add-wrapper-on');
        add_method_button.className === 'add-on' ? btn_first_step.textContent = 'Dodaj' : btn_first_step.textContent = 'Szukaj';
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
});

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

    const text_object = {
        teachers_object: {
            name: 'Imie',
            surname: 'Nazwisko',
            age: 'Wiek',
            subjects: 'Przedmioty'
        },
        classroom_object: {
            classroom: 'Numer pokoju',
            max_people: 'Maksymalna ilość ludzi',
            main_subjects: 'Przedmioty w klasie' 
        },
        subjects_object: {
            subject: 'Nazwa przedmiotu',
            classroom: 'W klasie nr',
            lessons_hours: 'Ilość godzin lekcyjnych',
            mandatory: 'Czy obowiązkowe'
        }
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
            field.label.first.innerText = text_object.classroom_object.classroom;
            field.label.first.setAttribute('value', 'classroom');
            field.input.first.setAttribute('type', 'number');
            field.label.second.innerText = text_object.classroom_object.max_people;
            field.label.second.setAttribute('value', 'max-people');
            field.input.second.setAttribute('type', 'number');
            field.label.third.innerText = text_object.classroom_object.main_subjects;
            field.label.third.setAttribute('value', 'main-subjects');
            field.input.third.setAttribute('type', 'text');
            field.label.fourth.style.display = 'none';
            field.input.fourth.style.display = 'none';
            break;

        case 'teachers':
            field.label.first.innerText = text_object.teachers_object.name;
            field.label.first.setAttribute('value', 'name');
            field.input.first.setAttribute('type', 'text');
            field.label.second.innerText = text_object.teachers_object.surname;
            field.label.second.setAttribute('value', 'surname');
            field.input.second.setAttribute('type', 'text');
            field.label.third.innerText = text_object.teachers_object.age;
            field.label.third.setAttribute('value', 'age');
            field.input.third.setAttribute('type', 'number');
            field.label.fourth.innerText = text_object.teachers_object.subjects;
            field.label.fourth.setAttribute('value', 'subjects');
            field.input.fourth.setAttribute('type', 'text');
            field.label.fourth.style.display = 'block';
            field.input.fourth.style.display = 'block';
            break;

        case 'subjects':
            field.label.first.innerText = text_object.subjects_object.subject;
            field.label.first.setAttribute('value', 'subject');
            field.input.first.setAttribute('type', 'text');
            field.label.second.innerText = text_object.subjects_object.classroom;
            field.label.second.setAttribute('value', 'classroom');
            field.input.second.setAttribute('type', 'number');
            field.label.third.innerText = text_object.subjects_object.lessons_hours;
            field.label.third.setAttribute('value', 'lessons_hours');
            field.input.third.setAttribute('type', 'number');
            field.label.fourth.innerText = text_object.subjects_object.mandatory;
            field.label.fourth.setAttribute('value', 'mandatory');
            field.input.fourth.setAttribute('type', 'text');
            field.label.fourth.style.display = 'block';
            field.input.fourth.style.display = 'block';
            break;

        default:
            break;
    };
};

console.log('Styling loaded');