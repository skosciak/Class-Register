import * as fs from 'fs';
import { openFile, searchIfKeyExist } from './reusable.js';

type key = { id: string };

export function addNewTeacher (name: string, surname: string, subjects: string[], age?: number) {
    if ((name === (null || undefined)) || (surname === (null || undefined)) || (subjects.length === 0)) {
        console.warn("Name, surname and at least one subject is mandatory!!!");
        return false;
    };
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    const new_teacher = {
        "name": name.toLowerCase(),
        "surname": surname.toLowerCase(),
        "age": age,
        "subjects": subjects.map(subjects => subjects.toLowerCase())
    };
    if (age === (null || undefined))
        delete new_teacher.age;
    read_file.teachers[returnFirstFreeID()] = new_teacher;
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return true;
};

export function returnFirstFreeID() {
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
    for (let i = 1; i < (id + 2); i++) {
        if (read_file.teachers[`id_${i}`] === undefined || null)
            return `id_${i}`;
    }
};

export function removeTeacher (id: key[] ){
    if (((Object.keys(id)).length !== 1) && typeof id !== "string") {
        console.warn(`Returned more than one teacher matching search result! Please specify more information for search!`);
        return {
            status: false,
            id: id
        };
    }
    else if (typeof id !== 'object' || typeof id !== 'string'){
        console.warn("Error occured!")
        return false;
    };
    const open_file = './Server/Database/teachers.json';
    const read_file = openFile(open_file, true);
    if (!searchIfKeyExist(open_file, id[0]['id'] || id)) {
        console.warn(`Teacher with this id ${id[0]['id']} does not exist`);
        return false;
    };
    if (typeof id == "string") {
        delete read_file.teachers[id];
    }
    else {
        delete read_file.teachers[id[0]['id']];
    }
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return true;
}

export function modifyTeacher (id: Object, name?: string, surname?: string, age?: number, subjects?: string[]) {
    let teacher = {
        "name": name.toLowerCase(),
        "surname": surname.toLowerCase(),
        "age": age,
        "subjects": subjects.map(subjects => subjects.toLowerCase())
    };
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

export function searchTeacher(name?: string, surname?: string, age?: number, subjects?: string[] | string) {

    if (name != undefined) {
        name = name.toLowerCase();
    }

    if (surname != undefined) {
        surname = surname.toLowerCase();
    }

    if (age && (age != undefined))
        age = parseInt(String(age));

    if (Array.isArray(subjects) && subjects != undefined) {
        subjects = subjects.map(subjects => subjects.toLowerCase());
    };
        
    let teacher = {
        "name": name,
        "surname": surname,
        "age": age,
        "subjects": subjects
    }

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
        if (subjects.length > 0){
            subject_exist = (Object.keys(teacher)).length - 1;
        };
    }
    catch {
        if (subjects !== undefined || null){
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
            if (subjects === undefined || null) {
                match[match.length] = {
                    'id': id
                };
            }
            else {
                for (const subject of read_file.teachers[id].subjects) {
                    if (typeof teacher.subjects != 'string') {
                        for (const search_subject of teacher.subjects) {
                            if (subject === search_subject)
                                count_matches++;
                        };
                        if (count_matches === (Object.keys(subjects)).length){
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