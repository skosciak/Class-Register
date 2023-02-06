"use strict";
window.addEventListener('DOMContentLoaded', () => {
    const button_database = document.querySelectorAll('.database');
    button_database.forEach(button => {
        button.addEventListener('click', (event) => validateInputAfterSubmit(event));
    });
});
function validateInputAfterSubmit(e) {
    function setErrorMsg(el) {
        el.setAttribute('style', 'border-color: rgb(253 15 15)');
        el.value = '';
        el.placeholder = `Wprowadzono niepoprawne dane. Typ danych: ${el.type}`;
        return true;
    }
    ;
    function clearAll() {
        first_input.value = '';
        second_input.value = '';
        third_input.value = '';
        fourth_input.value = '';
    }
    const first_input = document.querySelector('#first-field');
    const second_input = document.querySelector('#second-field');
    const third_input = document.querySelector('#third-field');
    const fourth_input = document.querySelector('#fourth-field');
    const button_submit = document.querySelector('#submit');
    button_submit.addEventListener('click', (button_submit_event) => {
        const letters = /\p{L}/gu;
        switch (e.target.id) {
            case 'database-teachers':
                if (!first_input.value.match(letters) && !(first_input.value === '')) {
                    clearAll();
                    setErrorMsg(first_input);
                    button_submit_event.preventDefault();
                }
                ;
                if (!second_input.value.match(letters) && !(second_input.value === '')) {
                    clearAll();
                    setErrorMsg(second_input);
                    button_submit_event.preventDefault();
                }
                ;
                if (!(typeof Number(third_input) === 'number') && !(third_input.value === '')) {
                    clearAll();
                    setErrorMsg(third_input);
                    button_submit_event.preventDefault();
                }
                ;
                if (!fourth_input.value.match(letters) && !(fourth_input.value === '')) {
                    clearAll();
                    setErrorMsg(fourth_input);
                    button_submit_event.preventDefault();
                }
                ;
                break;
            case 'database-classroom':
                if (!(typeof first_input === 'number') && !(first_input.value === '')) {
                    clearAll();
                    setErrorMsg(first_input);
                    button_submit_event.preventDefault();
                }
                ;
                if (!(typeof second_input === 'number') && !(second_input.value === '')) {
                    clearAll();
                    setErrorMsg(second_input);
                    button_submit_event.preventDefault();
                }
                ;
                if (third_input.value.match(letters) && !(third_input.value === '')) {
                    clearAll();
                    setErrorMsg(third_input);
                    button_submit_event.preventDefault();
                }
                ;
                break;
            case 'database-subjects':
                if (!first_input.value.match(letters) && !(first_input.value === '')) {
                    clearAll();
                    setErrorMsg(first_input);
                    button_submit_event.preventDefault();
                }
                ;
                if (!(typeof second_input === 'number') && !(second_input.value === '')) {
                    clearAll();
                    setErrorMsg(second_input);
                    button_submit_event.preventDefault();
                }
                ;
                if (!(typeof third_input === 'number') && !(third_input.value === '')) {
                    clearAll();
                    setErrorMsg(third_input);
                    button_submit_event.preventDefault();
                }
                ;
                if (!fourth_input.value.match(letters) && !(fourth_input.value === '')) {
                    clearAll();
                    setErrorMsg(fourth_input);
                    button_submit_event.preventDefault();
                }
                ;
                break;
            default:
                break;
        }
        ;
    }, { capture: true });
}
;
console.log('Validation loaded');
//# sourceMappingURL=validation.js.map