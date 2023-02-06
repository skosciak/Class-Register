import * as fs from 'fs';
import { openFile, searchIfKeyExist } from './reusable.js';

type key = { id: string };
type teacher = {
    name?: string,
    surname?: string,
    age?: number,
    subjects?: string[]
};

export function addNewTeacher (teacher: teacher) {
    teacher.name.toLowerCase();
    teacher.surname.toLowerCase(),
    teacher?.age,
    teacher.subjects.map(subjects => subjects.toLowerCase())
    if (teacher.age === (null || undefined))
        delete teacher.age;
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    const id: string = returnFirstFreeID();
    read_file.teachers[id] = teacher;
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return {
        status: true,
        id: id
    };
};

function returnFirstFreeID() {
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    let last_id: number = 0;
    let id: number = 0;
    for (const key in read_file.teachers) {
        id = Number(String(key).slice(3));
        if (id > last_id){
            last_id = id;
        };
    };
    for (let i = 1; i < (last_id + 2); i++) {
        if (read_file.teachers[`id_${i}`] === undefined || null)
            return `id_${i}`;
    }
};

export function removeTeacher (id: key | key[]){
    if (Array.isArray(id) && id.length != 1){
        console.warn("Error occured!")
        return false;
    };
    
    const teacher_id: string = id[0].id;
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    if (!searchIfKeyExist(open_file, teacher_id)) {
        console.warn(`Teacher with this id ${teacher_id} does not exist`);
        return false;
    };
    delete read_file.teachers[teacher_id];
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return true;
}

export function modifyTeacher (teacher: teacher, id?: key) {
    teacher.name.toLowerCase();
    teacher.surname.toLowerCase(),
    teacher.age,
    teacher.subjects?.map(subjects => subjects.toLowerCase())
    for (const [key, value] of Object.entries(teacher)) {
        if (value === undefined || null)
            delete teacher[key];
    };
    if((Object.keys(teacher)).length === 0){
        console.warn("No values for search!");
        return false;
    };
    if ((Object.keys(id)).length !== 1) {
        console.warn("Returned more than one teacher matching search result! Please specify more information for search!");
        return false;
    };
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    if (id !== undefined || null) {
        for (const key in teacher) {
            read_file.teachers[id[0].id][key] = teacher[key];
        };
    };
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
};

export function searchTeacher(teacher: teacher) {

    if (teacher.name != undefined) {
        teacher.name = teacher.name.toLowerCase();
    }

    if (teacher.surname != undefined) {
        teacher.surname = teacher.surname.toLowerCase();
    }

    if (teacher.age && (teacher.age != undefined))
        teacher.age = parseInt(String(teacher.age));

    if (Array.isArray(teacher.subjects) && teacher.subjects != undefined) {
        teacher.subjects = teacher.subjects.map(subjects => subjects.toLowerCase());
    };

    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    for (const [key, value] of Object.entries(teacher)) {
        if (value === undefined || null)
            delete teacher[key];
    };
    if((Object.keys(teacher)).length === 0){
        console.warn("No values for search!");
        return;
    };
    let subject_exist: number = 0
    let count_matches: number = 0;
    const match: key[] = [];
    
    //Checking if subjects are existing.
    try { 
        if (teacher.subjects.length > 0){
            subject_exist = (Object.keys(teacher)).length - 1;
        };
    }
    catch {
        if (teacher.subjects !== undefined || null){
            subject_exist = (Object.keys(teacher)).length - 1;
        }
        else {
            subject_exist = (Object.keys(teacher)).length;
        }
    };

    for (const id in read_file.teachers) {
        for (const new_key in teacher) {
            if (read_file.teachers[id][new_key] === teacher[new_key])
                count_matches++;
        };
        if (count_matches === subject_exist){
            count_matches = 0;
            if (teacher.subjects === undefined || null) {
                match[match.length] = {
                    'id': id
                };
            }
            else if (read_file.teachers[id].subjects !== undefined) {
                for (const subject of read_file.teachers[id].subjects) {
                    if (typeof teacher.subjects != 'string') {
                        for (const search_subject of teacher.subjects) {
                            if (subject === search_subject)
                                count_matches++;
                        };
                        if (count_matches === (Object.keys(teacher.subjects)).length){
                            match[match.length] = {
                                'id': id
                            };
                        };
                    };
                    if (subject === teacher.subjects) {
                        match[match.length] = {
                            'id': id
                        };
                    };
                    
                };
            };
            
        };
        count_matches = 0;
    };
    return match;
};

export function returnTeacherInfo(id: string) {
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    return read_file.teachers[id];
};

console.log("Loaded teachers module");