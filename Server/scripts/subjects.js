import * as fs from 'fs';
import { openFile, searchIfKeyExist } from './reusable';
export function addNewSubject(sub_name, sub_classroom, sub_lessons, mandatory) {
    const open_file = './Server/Database/subjects.json';
    const read_file = openFile(open_file, true);
    if (searchIfKeyExist(open_file, sub_name) === true) {
        console.warn(`This subject ${sub_name} already exist!`);
        return false;
    }
    ;
    let data = {
        "class": sub_classroom,
        "lesson_hours": sub_lessons,
        "mandatory": mandatory
    };
    read_file.school_subjects[sub_name] = data;
    const update_file = JSON.stringify(read_file, null, 4);
    fs.writeFileSync(open_file, update_file);
    return true;
}
;
export function deleteSubject(sub_name) {
    const open_file = './Server/Database/subjects.json';
    const read_file = openFile(open_file, true);
    if (searchIfKeyExist(open_file, sub_name) === false) {
        console.warn(`This subject ${sub_name} does not exist!`);
        return false;
    }
    ;
    delete read_file.school_subjects[sub_name];
    const update_file = JSON.stringify(read_file, null, 4);
    fs.writeFileSync(open_file, update_file);
    return true;
}
;
export function modifySubject(sub_name, sub_classroom, sub_lessons, mandatory) {
    const open_file = './Server/Database/subjects.json';
    const read_file = openFile(open_file, true);
    if (searchIfKeyExist(open_file, sub_name) === false) {
        console.warn(`This subject ${sub_name} does not exist! Cannot modify`);
        return false;
    }
    ;
    let data = {
        "class": sub_classroom,
        "lesson_hours": sub_lessons,
        "mandatory": mandatory
    };
    for (const key of Object.keys(data)) {
        if (data[key] === undefined || null)
            delete data[key];
    }
    ;
    if ((Object.keys(data)).length === 0) {
        console.warn("No values to modify!");
        return false;
    }
    ;
    for (const key of Object.keys(data)) {
        read_file.school_subjects[sub_name][key] = data[key];
    }
    ;
    const update_file = JSON.stringify(read_file, null, 4);
    fs.writeFileSync(open_file, update_file);
    return true;
}
;
console.log("End of file");
//# sourceMappingURL=subjects.js.map