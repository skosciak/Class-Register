
const input_validation: NodeListOf<HTMLDivElement> = document.querySelectorAll('.input-wrapper');
input_validation.forEach(el => el.addEventListener('click', () => {
    const button_database = document.querySelectorAll('.database') as NodeListOf<HTMLInputElement>;
    button_database.forEach(button => {
        button.addEventListener('click', (event) => validateInputAfterSubmit(event))
    });
}));

function validateInputAfterSubmit(e: any) {

    function setErrorMsg(el: HTMLInputElement) {
        el.setAttribute('style', 'border-color: rgb(253 15 15)');
        el.value = '';
        el.placeholder = `Wprowadzono niepoprawne dane. Typ danych: ${el.type}`;
        return true;
    };

    function clearErrorMsg(el: HTMLInputElement) {
        el.removeAttribute('style');
        el.removeAttribute('placeholder');
        return true;
    }

    const first_input = document.querySelector('#first-field') as HTMLInputElement;
    const second_input = document.querySelector('#second-field') as HTMLInputElement;
    const third_input = document.querySelector('#third-field') as HTMLInputElement;
    const fourth_input = document.querySelector('#fourth-field') as HTMLInputElement;


    const button_submit = document.querySelector('#submit') as HTMLButtonElement;
    button_submit.addEventListener('click', (button_submit_event) => {

        
        const letters = /\p{L}/gu;

        switch (e.target.id) {
            case 'database-teachers':
                if (!first_input.value.match(letters) && !(first_input.value === '')) {
                    first_input.value = '';
                    setErrorMsg(first_input);
                    button_submit_event.preventDefault();
                } else clearErrorMsg(first_input);
                if (!second_input.value.match(letters) && !(second_input.value === '')) {
                    second_input.value = '';
                    setErrorMsg(second_input);
                    button_submit_event.preventDefault();
                } else clearErrorMsg(second_input);
                if (!(typeof Number(third_input.value) === 'number') && !(third_input.value === '') && !(third_input.type === 'number')) {
                    third_input.value = '';
                    setErrorMsg(third_input);
                    button_submit_event.preventDefault();
                } else clearErrorMsg(third_input);
                if (!fourth_input.value.match(letters) && !(fourth_input.value === '')) {
                    fourth_input.value = '';
                    setErrorMsg(fourth_input);
                    button_submit_event.preventDefault();
                } else clearErrorMsg(fourth_input);
                break;

            case 'database-classroom':
                if(!(first_input.type === 'number') && !(first_input.value === '') && !(typeof Number(first_input.value) === 'number')) {
                    first_input.value = '';
                    setErrorMsg(first_input);
                    button_submit_event.preventDefault();
                } else clearErrorMsg(first_input);
                if(!(second_input.type === 'number') && !(second_input.value === '') && !(typeof Number(second_input.value) === 'number')) {
                    second_input.value = '';
                    setErrorMsg(second_input);
                    button_submit_event.preventDefault();
                } else clearErrorMsg(second_input);
                if(!third_input.value.match(letters) && !(third_input.value === '')) {
                    third_input.value = '';
                    setErrorMsg(third_input);
                    button_submit_event.preventDefault();
                } else clearErrorMsg(third_input);
                break;

            case 'database-subjects':
                if (!first_input.value.match(letters) && !(first_input.value === '')) {
                    first_input.value = '';
                    setErrorMsg(first_input);
                    button_submit_event.preventDefault();
                } else clearErrorMsg(first_input);
                if(!(second_input.type === 'number') && !(second_input.value === '') && !(typeof Number(second_input.value) === 'number')) {
                    second_input.value = '';
                    setErrorMsg(second_input);
                    button_submit_event.preventDefault();
                } else clearErrorMsg(second_input);
                if (!(third_input.type === 'number') && !(third_input.value === '') && !(typeof Number(third_input.value) === 'number')) {
                    third_input.value = '';
                    setErrorMsg(third_input);
                    button_submit_event.preventDefault();
                } else clearErrorMsg(third_input);
                if (!fourth_input.value.match(letters) && !(fourth_input.value === '')) {
                    fourth_input.value = '';
                    setErrorMsg(fourth_input);
                    button_submit_event.preventDefault();
                } else clearErrorMsg(fourth_input);
                break;
        
            default:
                break;
        };
    }, {capture: true});
};

console.log('Validation loaded');