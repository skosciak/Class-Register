
//
//GLOBAL EXPORTS
//
export interface search {
    perfect: {
        id: string;
        data: object;
    }[];
    imperfect: {
        id: string;
        data: object;
    }[];
}

//
//CLASSROOM EXPORTS
//

export interface classroom {
    classroom?: number,
    main_subject?: string,
    max_people?: number,
};

export interface data_classroom extends classroom {
    search_type: string
};

export class Classroom {
    classroom?: number;
    main_subject?: string;
    max_people?: number;

    constructor(classroom: classroom, number?: number) {
        this.classroom = classroom.classroom || number;
        this.main_subject = classroom.main_subject
        this.max_people = classroom.max_people
    };

    deleteEmpty() {
        if (this.classroom === undefined) 
            delete this.classroom;
        if (this.main_subject === undefined || this.main_subject === '') 
            delete this.main_subject;
        if (this.max_people === undefined)
            delete this.max_people
    };

    toLowerCaseMethod() {
        if (this.main_subject != undefined) 
            this.main_subject = this.main_subject.toLowerCase();
        if (this.classroom != undefined)
            this.classroom = Number(String(this.classroom));
        if (this.max_people != undefined)
            this.max_people = Number(String(this.max_people));
    };
};

//
//TEACHERS EXPORTS
//

export interface teacher {
    name?: string,
    surname?: string,
    age?: number,
    subject?: string[]
};

export interface data_teacher extends teacher {
    search_type: string
}; 

export class Teacher {
    name?: string;
    surname?: string;
    age?: number;
    subject?: string | string[];

    constructor(teacher: teacher) {
        this.name = teacher.name;
        this.surname = teacher.surname;
        this.age = teacher.age;
        this.subject = teacher.subject;
    };

    deleteEmpty() {
        if (this.name === undefined || this.name === '') 
            delete this.name;
        if (this.surname === undefined || this.surname === '') 
            delete this.surname;
        if (this.age === undefined)
            delete this.age
        if (this.subject === undefined || (this.subject.length === 1 && this.subject[0] === ''))
            delete this.subject;
    };

    toLowerCaseMethod() {
        if (this.name != undefined) 
            this.name = this.name.toLowerCase();
        if (this.surname != undefined) 
            this.surname = this.surname.toLowerCase();
        if (this.age != undefined)
            this.age = parseInt(String(this.age))
        if (this.subject != undefined || (this.subject != undefined && this.subject.length !== 1 && this.subject[0] !== '')){
            if (Array.isArray(this.subject))
                this.subject = this.subject.map(subject => subject.toLowerCase());
            else if (typeof this.subject === 'string'){
                this.subject = this.subject.toLowerCase(); 
                const array_present = (Array.from(this.subject)).includes('[' || ']')
                if (array_present === true)
                    this.subjectsToArray(this.subject);
            }
            else
                this.subjectsToArray(this.subject);
        };

    }

    subjectsToArray(type_string: string) {
            let temp_subjects: string[] = type_string.split('')
            let temp_array_start: number;
            let temp_array_end: number;
            let temp_array: string[] = [];
            temp_subjects = temp_subjects.filter(letter => letter !== ' ')
            for (let i = 0; i < temp_subjects.length; i++) {
                if (temp_subjects[i] === '[')
                    temp_array_start = i + 1;
                if (temp_subjects[i] === ',' && temp_subjects[i - 1] === ',')
                    i++;
                else if (temp_subjects[i] === ','){
                    temp_array[temp_array.length] = temp_subjects.slice(temp_array_start, i).join('');
                    if (temp_array[temp_array.length - 1] === '' || temp_array[temp_array.length - 1] === ' ')
                        temp_array.pop();
                    temp_array_start = i + 1;
                };
                if (temp_subjects[i] === ']'){
                    temp_array_end = i;
                    temp_array[temp_array.length] = temp_subjects.slice(temp_array_start, temp_array_end).join('')
                };
            };
            this.subject = temp_array;
    };
};

//
//SUBJECTS EXPORTS
//

export interface subject {
    lesson?: string;
    classroom?: number;
    lesson_hours?: number;
    mandatory?: boolean;
};

export interface data_subject extends subject {
    search_type: string
}; 

export class Subject {
    lesson?: string;
    classroom?: number;
    lesson_hours?: number;
    mandatory?: boolean;

    constructor(subject: subject) {
        this.lesson = subject.lesson;
        this.classroom = subject.classroom;
        this.lesson_hours = subject.lesson_hours
        this.mandatory = subject.mandatory
    };

    deleteEmpty() {
        this.classroom ?? delete this.classroom;
        this.lesson ?? delete this.lesson;
        this.lesson_hours ?? delete this.lesson_hours;
        this.mandatory ?? delete this.mandatory;
    };

    toLowerCaseMethod() {
        if (this.lesson === undefined)
            this.lesson.toLowerCase();
        if (this.lesson_hours === undefined) 
            parseInt(String(this.lesson_hours));
        if (this.classroom === undefined) 
            parseInt(String(this.classroom));
    };
};