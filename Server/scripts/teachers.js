import * as fs from 'fs';
import { openFile, searchIfKeyExist } from './reusable.js';
class Teacher {
    constructor(teacher) {
        this.name = teacher.name;
        this.surname = teacher.surname;
        this.age = teacher.age;
        this.subjects = teacher.subjects;
    }
    ;
    deleteEmpty() {
        if (this.name === undefined || this.name === '')
            delete this.name;
        if (this.surname === undefined || this.surname === '')
            delete this.surname;
        if (this.age === undefined || null)
            delete this.age;
        if (this.subjects === undefined || (this.subjects.length === 1 && this.subjects[0] === ''))
            delete this.subjects;
    }
    ;
    toLowerCaseMethod() {
        if (this.name != undefined)
            this.name = this.name.toLowerCase();
        if (this.surname != undefined)
            this.surname = this.surname.toLowerCase();
        if (this.age != undefined)
            this.age = parseInt(String(this.age));
        if (this.subjects != undefined || (this.subjects != undefined && this.subjects.length !== 1 && this.subjects[0] !== ''))
            if (Array.isArray(this.subjects))
                this.subjects = this.subjects.map(subjects => subjects.toLowerCase());
            else {
                this.subjectsToArray(this.subjects);
            }
        ;
    }
    subjectsToArray(type_string) {
        if (typeof this.subjects === 'string') {
            let temp_subjects = type_string.split('');
            let temp_array_start;
            let temp_array_end;
            let temp_array = [];
            temp_subjects = temp_subjects.filter(letter => letter !== ' ');
            for (let i = 0; i < temp_subjects.length; i++) {
                if (temp_subjects[i] === '[')
                    temp_array_start = i + 1;
                if (temp_subjects[i] === ',' && temp_subjects[i - 1] === ',')
                    i++;
                else if (temp_subjects[i] === ',') {
                    temp_array[temp_array.length] = temp_subjects.slice(temp_array_start, i).join('');
                    if (temp_array[temp_array.length - 1] === '' || temp_array[temp_array.length - 1] === ' ')
                        temp_array.pop();
                    temp_array_start = i + 1;
                }
                ;
                if (temp_subjects[i] === ']') {
                    temp_array_end = i;
                    temp_array[temp_array.length] = temp_subjects.slice(temp_array_start, temp_array_end).join('');
                }
                ;
            }
            ;
            this.subjects = temp_array;
        }
        ;
    }
}
export function addNewTeacher(data_from_server) {
    const teacher = new Teacher(data_from_server);
    teacher.deleteEmpty();
    teacher.toLowerCaseMethod();
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    const id = returnFirstFreeID();
    read_file.teachers[id] = teacher;
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return {
        status: true,
        id: id
    };
}
;
function returnFirstFreeID() {
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    let last_id = 0;
    let id = 0;
    for (const key in read_file.teachers) {
        id = Number(String(key).slice(3));
        if (id > last_id) {
            last_id = id;
        }
        ;
    }
    ;
    for (let i = 1; i < (last_id + 2); i++) {
        if (read_file.teachers[`id_${i}`] === undefined || null)
            return `id_${i}`;
    }
}
;
export function removeTeacher(id) {
    if (Array.isArray(id) && id.length != 1) {
        console.warn("Error occured!");
        return false;
    }
    ;
    const teacher_id = id[0].id;
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    if (!searchIfKeyExist(open_file, teacher_id)) {
        console.warn(`Teacher with this id ${teacher_id} does not exist`);
        return false;
    }
    ;
    delete read_file.teachers[teacher_id];
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return true;
}
export function modifyTeacher(data_from_server, id) {
    const teacher = new Teacher(data_from_server);
    teacher.deleteEmpty();
    teacher.toLowerCaseMethod();
    for (const [key, value] of Object.entries(teacher)) {
        if (value === undefined || null)
            delete teacher[key];
    }
    ;
    if ((Object.keys(teacher)).length === 0) {
        console.warn("No values for search!");
        return false;
    }
    ;
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    if (id !== undefined || null) {
        for (const key in teacher) {
            read_file.teachers[id][key] = teacher[key];
        }
        ;
    }
    ;
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return true;
}
;
export function searchTeacher(data_from_server) {
    const teacher = new Teacher(data_from_server);
    teacher.deleteEmpty();
    teacher.toLowerCaseMethod();
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    for (const [key, value] of Object.entries(teacher)) {
        if (value === undefined || null)
            delete teacher[key];
    }
    ;
    if ((Object.keys(teacher)).length === 0) {
        console.warn("No values for search!");
        return;
    }
    ;
    let subject_exist = 0;
    let count_matches = 0;
    const match = [];
    //Checking if subjects are existing.
    try {
        if (teacher.subjects.length > 0) {
            subject_exist = teacher.subjects.length;
        }
        ;
    }
    catch (_a) {
        if (teacher.subjects !== undefined) {
            subject_exist = teacher.subjects.length;
        }
        else {
            subject_exist = 0;
        }
    }
    ;
    for (const id in read_file.teachers) {
        for (const new_key in teacher) {
            if (read_file.teachers[id][new_key] === teacher[new_key])
                count_matches++;
        }
        ;
        if (subject_exist === 0 && count_matches === (Object.keys(teacher)).length) {
            match[match.length] = {
                'id': id
            };
            count_matches = 0;
        }
        if (subject_exist > 0 && count_matches === ((Object.keys(teacher)).length - 1)) {
            count_matches = 0;
            if (read_file.teachers[id].subjects !== undefined) {
                for (const subject of read_file.teachers[id].subjects) {
                    if (Array.isArray(teacher.subjects)) {
                        for (const search_subject of teacher.subjects) {
                            if (subject === search_subject)
                                count_matches++;
                        }
                        ;
                    }
                    ;
                }
                ;
                if (count_matches === (Object.keys(teacher.subjects)).length) {
                    match[match.length] = {
                        'id': id
                    };
                }
                ;
            }
            ;
            count_matches = 0;
        }
        ;
        count_matches = 0;
    }
    ;
    return match;
}
;
export function returnTeacherInfo(id) {
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    return read_file.teachers[id];
}
;
console.log("Loaded teachers module");
//# sourceMappingURL=teachers.js.map