
window.addEventListener('DOMContentLoaded', () => {

    const button_database = document.querySelectorAll('.database') as NodeListOf<HTMLInputElement>;

    button_database.forEach(button => {
        button.addEventListener('click', (event) => validateInputAfterSubmit(event))
    });
});

function validateInputAfterSubmit(e: any) {

    function setErrorMsg(el: HTMLInputElement) {
        el.setAttribute('style', 'border-color: rgb(253 15 15)');
        el.value = '';
        el.placeholder = `Wprowadzono niepoprawne dane. Typ danych: ${el.type}`;
    };

    const first_input = document.querySelector('#first-field') as HTMLInputElement;
    const second_input = document.querySelector('#second-field') as HTMLInputElement;
    const third_input = document.querySelector('#third-field') as HTMLInputElement;
    const fourth_input = document.querySelector('#fourth-field') as HTMLInputElement;

    const letters = /^[A-Za-z]+$/;

    const button_submit = document.querySelector('#submit') as HTMLButtonElement;
    button_submit.addEventListener('click', () => {
        switch (e.target.id) {
            case 'database-teachers':
                if (!first_input.value.match(letters) && !(first_input.value === ''))
                    setErrorMsg(first_input);
                if (!second_input.value.match(letters) && !(second_input.value === ''))
                    setErrorMsg(second_input);
                if (!(typeof Number(third_input) === 'number') && !(third_input.value === ''))
                    setErrorMsg(third_input);
                if (!fourth_input.value.match(letters) && !(fourth_input.value === ''))
                    setErrorMsg(fourth_input);
                break;

            case 'database-classroom':
                if(!(typeof first_input === 'number') && !(first_input.value === ''))
                    setErrorMsg(first_input);
                if(!(typeof second_input === 'number') && !(second_input.value === ''))
                    setErrorMsg(second_input);
                if(third_input.value.match(letters) && !(third_input.value === ''))
                    setErrorMsg(third_input);
                break;

            case 'database-subjects':
                if (!first_input.value.match(letters) && !(first_input.value === ''))
                    setErrorMsg(first_input);
                if(!(typeof second_input === 'number') && !(second_input.value === ''))
                    setErrorMsg(second_input);
                if (!(typeof third_input === 'number') && !(third_input.value === ''))
                    setErrorMsg(third_input);
                if (!fourth_input.value.match(letters) && !(fourth_input.value === ''))
                    setErrorMsg(fourth_input);
                break;
        
            default:
                break;
        };
    });
    console.log(e.target.id);
};

console.log('Validation loaded');