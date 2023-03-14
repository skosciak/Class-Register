import * as fs from 'fs';
import { openFile, searchIfKeyExist } from './reusable.js';
class Classroom {
    constructor(classroom, number) {
        this.number = classroom.number || classroom.classroom || number;
        this.main_subject = classroom.main_subject;
        this.max_people = classroom.max_people;
    }
    ;
    deleteEmpty() {
        if (this.number === undefined)
            delete this.number;
        if (this.main_subject === undefined || this.main_subject === '')
            delete this.main_subject;
        if (this.max_people === undefined)
            delete this.max_people;
    }
    ;
    toLowerCaseMethod() {
        if (this.main_subject != undefined)
            this.main_subject = this.main_subject.toLowerCase();
        if (this.number != undefined)
            this.number = Number(String(this.number));
        if (this.max_people != undefined)
            this.max_people = Number(String(this.max_people));
    }
    ;
}
;
export function addClassroom(data_from_server) {
    const classroom = new Classroom(data_from_server);
    classroom.deleteEmpty();
    classroom.toLowerCaseMethod();
    const open_file = './Server/Database/classroom.json';
    const read_file = openFile(open_file, true);
    if (searchIfKeyExist(open_file, classroom.number)) {
        console.warn('Classroom exist! Could not add new classroom.');
        return {
            status: false,
            msg: 'Classroom exist! Could not add new classroom.'
        };
    }
    else if (classroom.number !== undefined && isNaN(Number(classroom.number))) {
        console.warn('Entered non numerical value for classroom number!');
        return {
            status: false,
            msg: 'Entered non numerical value for classroom number!'
        };
    }
    else if (classroom.number === undefined) {
        console.warn('Cannot add classroom without number');
        return {
            status: false,
            msg: 'Cannot add classroom without number'
        };
    }
    const classroom_id = classroom.number;
    delete classroom.number;
    read_file.classroom[classroom_id] = classroom;
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return true;
}
;
export function removeClassroom(number) {
    const open_file = './Server/Database/classroom.json';
    const read_file = openFile(open_file, true);
    if (!searchIfKeyExist(open_file, number)) {
        console.warn('Classroom does not exist!');
        return {
            status: false,
            msg: 'Classroom does not exist!'
        };
    }
    else if (isNaN(Number(number))) {
        console.warn('Entered non numerical value for classroom number!');
        return {
            status: false,
            msg: 'Entered non numerical value for classroom number!'
        };
    }
    ;
    delete read_file.classroom[number];
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return true;
}
;
export function modifyClassroom(data_from_server, data_to_modify) {
    const classroom = new Classroom(data_from_server);
    classroom.deleteEmpty();
    classroom.toLowerCaseMethod();
    const toModify = new Classroom(data_to_modify);
    toModify.deleteEmpty();
    classroom.toLowerCaseMethod();
    const open_file = './Server/Database/classroom.json';
    const read_file = openFile(open_file, true);
    for (const key in classroom) {
        read_file.classroom[number][key] = classroom[key];
    }
    ;
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
}
;
export function searchClassroom(data_from_server) {
    const classroom = new Classroom(data_from_server);
    classroom.deleteEmpty();
    classroom.toLowerCaseMethod();
    const matched_classroom = [];
    const open_file = './Server/Database/classroom.json';
    const read_file = openFile(open_file, true);
    if (classroom.number !== undefined && read_file.classroom[classroom.number] !== undefined) {
        matched_classroom[matched_classroom.length] = {
            id: `id_${classroom.number}`,
            data: new Classroom(read_file.classroom[classroom.number], classroom.number)
        };
        return matched_classroom;
    }
    else {
        delete classroom.number;
        if ((Object.keys(classroom)).length === 0) {
            console.warn('Nothing to search!!!');
            return matched_classroom;
        }
        ;
        let count_matches = 0;
        for (const classroom_number in read_file.classroom) {
            for (const key in read_file.classroom[classroom_number]) {
                for (const key_server in classroom) {
                    if (read_file.classroom[classroom_number][key] === classroom[key_server])
                        count_matches++;
                }
                ;
                if (count_matches === (Object.keys(classroom)).length) {
                    matched_classroom[matched_classroom.length] = {
                        id: `id_${classroom_number}`,
                        data: new Classroom(read_file.classroom[classroom_number], Number(classroom_number))
                    };
                }
                count_matches = 0;
            }
            ;
        }
        ;
    }
    ;
    return matched_classroom;
}
;
console.log("Loaded classrooms module");
//# sourceMappingURL=classroom.js.map