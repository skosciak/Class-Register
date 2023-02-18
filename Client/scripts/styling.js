"use strict";
window.addEventListener('DOMContentLoaded', () => {
    const input_wrapper = document.querySelectorAll('.input-wrapper');
    const button_radio = document.querySelectorAll('input[type="radio"]');
    const btn_method = document.querySelectorAll('.first-step');
    const btn_first_step = document.querySelector('#submit');
    const add_method_button = document.querySelector('#method-add-button');
    const btn_modify = document.querySelector('#method-modify');
    const btn_delete = document.querySelector('#method-delete');
    //Adding event listener to which database user chosen
    btn_method.forEach(el => {
        el.addEventListener('click', () => switchText(el.value));
    });
    btn_modify.addEventListener('click', () => {
        btn_method.forEach(el => {
            if (el.checked === true)
                switchText(el.value, 'second-step');
        });
    });
    btn_delete.addEventListener('click', () => {
        const modify_wrapper = document.querySelector('#inputs-modify');
        modify_wrapper.classList.value = 'modify-unselect';
    });
    add_method_button.addEventListener('click', (event) => {
        const add_method_button_wrapper = document.querySelector('#method-add-button-wrapper');
        add_method_button.classList.toggle('add-off');
        add_method_button.classList.toggle('add-on');
        add_method_button_wrapper.classList.toggle('add-wrapper-off');
        add_method_button_wrapper.classList.toggle('add-wrapper-on');
        add_method_button.className === 'add-on' ? btn_first_step.textContent = 'Dodaj' : btn_first_step.textContent = 'Szukaj';
        event.preventDefault();
    });
    for (let i = 0; i < input_wrapper.length; i++) {
        button_radio[i].addEventListener('click', (e) => {
            input_wrapper.forEach((wrapper) => {
                if (wrapper.className === 'input-wrapper label-checked')
                    wrapper.classList.toggle('label-checked');
            });
            input_wrapper[i].classList.toggle('label-checked');
            e.stopPropagation();
        });
    }
    ;
});
//Function switch text when user change databases
function switchText(method_text_change, step) {
    class input_field {
        constructor(id) {
            this.field = id;
        }
        ;
        returnLabel() {
            return document.querySelector(`#${this.field}`);
        }
        ;
        returnInput() {
            return document.querySelector(`#${this.field}`);
        }
        ;
    }
    ;
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
        first_step: {
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
        },
        second_step: {
            label: {
                first: new input_field('first-field-modify-label').returnLabel(),
                second: new input_field('second-field-modify-label').returnLabel(),
                third: new input_field('third-field-modify-label').returnLabel(),
                fourth: new input_field('fourth-field-modify-label').returnLabel()
            },
            input: {
                first: new input_field('first-modify-field').returnInput(),
                second: new input_field('second-modify-field').returnInput(),
                third: new input_field('third-modify-field').returnInput(),
                fourth: new input_field('fourth-modify-field').returnInput()
            }
        }
    };
    if (step === 'second-step') {
        const modify_wrapper = document.querySelector('#inputs-modify');
        modify_wrapper.classList.toggle('modify-unselect');
        modify_wrapper.classList.toggle('modify-select');
        field.second_step.label.first.innerText = field.first_step.label.first.innerText;
        field.second_step.label.first.setAttribute('value', field.first_step.label.first.attributes.getNamedItem('value').value);
        field.second_step.input.first.setAttribute('type', field.first_step.input.first.attributes.getNamedItem('type').value);
        field.second_step.label.second.innerText = field.first_step.label.second.innerText;
        field.second_step.label.second.setAttribute('value', field.first_step.label.second.attributes.getNamedItem('value').value);
        field.second_step.input.second.setAttribute('type', field.first_step.input.second.attributes.getNamedItem('type').value);
        field.second_step.label.third.innerText = field.first_step.label.third.innerText;
        field.second_step.label.third.setAttribute('value', field.first_step.label.third.attributes.getNamedItem('value').value);
        field.second_step.input.third.setAttribute('type', field.first_step.input.third.attributes.getNamedItem('type').value);
        field.second_step.label.fourth.innerText = field.first_step.label.fourth.innerText;
        field.second_step.label.fourth.setAttribute('value', field.first_step.label.fourth.attributes.getNamedItem('value').value);
        field.second_step.input.fourth.setAttribute('type', field.first_step.input.fourth.attributes.getNamedItem('type').value);
        if (field.first_step.input.fourth.style.display === 'none') {
            field.second_step.label.fourth.style.display = 'none';
            field.second_step.input.fourth.style.display = 'none';
        }
        else {
            field.second_step.label.fourth.style.display = 'block';
            field.second_step.input.fourth.style.display = 'block';
        }
        return;
    }
    ;
    const input_wrapper = document.querySelector('#inputs');
    input_wrapper.classList.value = 'inputs-select';
    switch (method_text_change) {
        case 'classroom':
            field.first_step.label.first.innerText = text_object.classroom_object.classroom;
            field.first_step.label.first.setAttribute('value', 'classroom');
            field.first_step.input.first.setAttribute('type', 'number');
            field.first_step.input.first.setAttribute('for-attr', 'classroom');
            field.first_step.label.second.innerText = text_object.classroom_object.max_people;
            field.first_step.label.second.setAttribute('value', 'max-people');
            field.first_step.input.second.setAttribute('type', 'number');
            field.first_step.input.second.setAttribute('for-attr', 'max-people');
            field.first_step.label.third.innerText = text_object.classroom_object.main_subjects;
            field.first_step.label.third.setAttribute('value', 'main-subjects');
            field.first_step.input.third.setAttribute('type', 'text');
            field.first_step.input.third.setAttribute('for-attr', 'main-subjects');
            field.first_step.label.fourth.style.display = 'none';
            field.first_step.input.fourth.style.display = 'none';
            break;
        case 'teachers':
            field.first_step.label.first.innerText = text_object.teachers_object.name;
            field.first_step.label.first.setAttribute('value', 'name');
            field.first_step.input.first.setAttribute('type', 'text');
            field.first_step.input.first.setAttribute('for-attr', 'name');
            field.first_step.label.second.innerText = text_object.teachers_object.surname;
            field.first_step.label.second.setAttribute('value', 'surname');
            field.first_step.input.second.setAttribute('type', 'text');
            field.first_step.input.second.setAttribute('for-attr', 'surname');
            field.first_step.label.third.innerText = text_object.teachers_object.age;
            field.first_step.label.third.setAttribute('value', 'age');
            field.first_step.input.third.setAttribute('type', 'number');
            field.first_step.input.third.setAttribute('for-attr', 'age');
            field.first_step.label.fourth.innerText = text_object.teachers_object.subjects;
            field.first_step.label.fourth.setAttribute('value', 'subjects');
            field.first_step.input.fourth.setAttribute('type', 'text');
            field.first_step.input.fourth.setAttribute('for-attr', 'subjects');
            field.first_step.label.fourth.style.display = 'block';
            field.first_step.input.fourth.style.display = 'block';
            break;
        case 'subjects':
            field.first_step.label.first.innerText = text_object.subjects_object.subject;
            field.first_step.label.first.setAttribute('value', 'subject');
            field.first_step.input.first.setAttribute('type', 'text');
            field.first_step.input.first.setAttribute('for-attr', 'subject');
            field.first_step.label.second.innerText = text_object.subjects_object.classroom;
            field.first_step.label.second.setAttribute('value', 'classroom');
            field.first_step.input.second.setAttribute('type', 'number');
            field.first_step.input.second.setAttribute('for-attr', 'classroom');
            field.first_step.label.third.innerText = text_object.subjects_object.lessons_hours;
            field.first_step.label.third.setAttribute('value', 'lessons_hours');
            field.first_step.input.third.setAttribute('type', 'number');
            field.first_step.input.third.setAttribute('for-attr', 'lesson_hours');
            field.first_step.label.fourth.innerText = text_object.subjects_object.mandatory;
            field.first_step.label.fourth.setAttribute('value', 'mandatory');
            field.first_step.input.fourth.setAttribute('type', 'text');
            field.first_step.input.fourth.setAttribute('for-attr', 'mandatory');
            field.first_step.label.fourth.style.display = 'block';
            field.first_step.input.fourth.style.display = 'block';
            break;
        default:
            break;
    }
    ;
}
;
console.log('Styling loaded');
//# sourceMappingURL=styling.js.map