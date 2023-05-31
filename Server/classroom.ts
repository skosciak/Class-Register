import * as fs from 'fs';
import { openFile, searchForMatch, searchIfKeyExist, returnFirstFreeID } from './reusable.js';
import { Classroom, classroom, search } from './types.js';

export function addNewClassroom(data_from_server: classroom) {
    const classroom: Classroom = new Classroom(data_from_server); 
    classroom.deleteEmpty();
    classroom.toLowerCaseMethod();
    const open_file = './Server/Database/classrooms.json';
    const read_file = openFile(open_file, true);
    const id: string = returnFirstFreeID('classrooms');
    read_file.classrooms[id] = classroom;
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return { status: true, id: id };
};

export function removeClassroom(data: {id: string, data: object}) {
    const open_file = './Server/Database/classrooms.json';
    const read_file = openFile(open_file, true);
    if (!searchIfKeyExist(open_file, data.id)){
        console.warn('Classroom does not exist!');  
        return { status: false, msg: 'Classroom does not exist!' };
    };
    const classroom_delete = read_file.classroom[data.id];
    delete read_file.classroom[data.id];
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return { status: true, data: classroom_delete };
};

export function modifyClassroom(data_from_server: classroom, id?: string) {
    const classroom = new Classroom(data_from_server);
    classroom.deleteEmpty();
    classroom.toLowerCaseMethod();
    if((Object.keys(classroom)).length === 0){
        console.warn('No values for search!');
        return { status: false, msg: 'No values for search!' };
    };
    const open_file = './Server/Database/classrooms.json';
    const read_file = openFile(open_file, true);
    if (id !== undefined || null) {
        for (const key in classroom) {
            read_file.classrooms[id][key] = classroom[key];
        };
    }
    else {
        console.warn('No values for update!');
        return { status: false, msg: 'No values for update!' };
    };
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return { status: true, data: read_file.classrooms[id] };
};

export function searchClassroom(data_from_server: classroom) {
    const classroom = new Classroom(data_from_server);
    classroom.deleteEmpty();
    classroom.toLowerCaseMethod();
    const open_file = './Server/Database/classrooms.json';
    const read_file = openFile(open_file, true);
    return searchForMatch('classroom', read_file.classrooms, classroom);
};

console.log("Loaded classrooms module");