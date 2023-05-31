import * as fs from 'fs';
import { openFile, searchForMatch, searchIfKeyExist, returnFirstFreeID } from './reusable.js';
import { Teacher, teacher } from './types.js'

export function addNewTeacher (data_from_server: teacher) {
    const teacher: Teacher = new Teacher(data_from_server);
    teacher.deleteEmpty();
    teacher.toLowerCaseMethod();
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    const id: string = returnFirstFreeID('teachers');
    read_file.teachers[id] = teacher;
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return { status: true, id: id };
};

export function removeTeacher (data: {id: string, data: object}){
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    if (!searchIfKeyExist(open_file, data.id)) {
        console.warn(`Teacher does not exist!`);
        return { status: false, msg: `Teacher does not exist!` };
    };
    const teacher_delete: object = read_file.teachers[data.id];
    delete read_file.teachers[data.id];
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return { status: true, data: teacher_delete };
};

export function modifyTeacher (data_from_server: teacher, id?: string) {
    const teacher: Teacher = new Teacher(data_from_server);
    teacher.deleteEmpty();
    teacher.toLowerCaseMethod();
    if((Object.keys(teacher)).length === 0){
        console.warn('No values for search!');
        return { status: false, msg: 'No values for search!' };
    };
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    if (id !== undefined || null) {
        for (const key in teacher) {
            read_file.teachers[id][key] = teacher[key];
        };
    }
    else {
        console.warn('No values for update!');
        return { status: false, msg: 'No values for update!' };
    };
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return { status: true, data: read_file.teachers[id] };
};

export function searchTeacher(data_from_server: teacher) {
    const teacher: Teacher = new Teacher(data_from_server);
    teacher.deleteEmpty();
    teacher.toLowerCaseMethod();
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    return searchForMatch('teachers' ,read_file.teachers, teacher);
};

console.log("Loaded teachers module");
