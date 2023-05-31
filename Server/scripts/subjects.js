import * as fs from 'fs';
import { openFile, returnFirstFreeID, searchForMatch, searchIfKeyExist } from './reusable.js';
import { Subject } from './types.js';
export function addNewSubject(data_from_server) {
    const subject = new Subject(data_from_server);
    subject.deleteEmpty();
    subject.toLowerCaseMethod();
    const open_file = './Server/Database/subjects.json';
    const read_file = openFile(open_file, true);
    const id = returnFirstFreeID('subjects');
    read_file.subjects[id] = subject;
    const update_file = JSON.stringify(read_file, null, 4);
    fs.writeFileSync(open_file, update_file);
    return { status: true, id: id };
}
;
export function removeSubject(data) {
    const open_file = './Server/Database/subjects.json';
    const read_file = openFile(open_file, true);
    if (!searchIfKeyExist(open_file, data.id)) {
        console.warn(`Subject does not exist!`);
        return { status: false, msg: 'Subject does not exist' };
    }
    ;
    const subject_delete = read_file.subjects[data.id];
    delete read_file.subjects[data.id];
    const update_file = JSON.stringify(read_file, null, 4);
    fs.writeFileSync(open_file, update_file);
    return { status: true, data: subject_delete };
}
;
export function modifySubject(data_from_server, id) {
    const subject = new Subject(data_from_server);
    subject.deleteEmpty();
    subject.toLowerCaseMethod();
    if ((Object.keys(subject)).length === 0) {
        console.warn('No values for search!');
        return { status: false, msg: 'No values for search!' };
    }
    ;
    const open_file = './Server/Database/subjects.json';
    const read_file = openFile(open_file, true);
    if (id !== undefined || null) {
        for (const key in subject) {
            read_file.subjects[id][key] = subject[key];
        }
        ;
    }
    else {
        console.warn('No values for update!');
        return { status: false, msg: 'No values for update!' };
    }
    ;
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return { status: true, data: read_file.subjects[id] };
}
;
export function searchSubject(data_from_server) {
    const subject = new Subject(data_from_server);
    subject.deleteEmpty();
    subject.toLowerCaseMethod();
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    return searchForMatch('teachers', read_file.teachers, subject);
}
;
console.log("Loaded subjects module");
//# sourceMappingURL=subjects.js.map