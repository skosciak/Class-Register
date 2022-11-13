'use_strict';
import * as fs from 'fs';
//const fs = require('fs');

function addNewSubject(sub_name: string, sub_classroom: string, mandatory: boolean, sub_lessons: number) {
    const open_file = 'Database/subjects.json';
    const read_file = openSubjects('Database/subjects.json', true);
    let data = {
            "class": sub_classroom,
            "lesson_hours": sub_lessons,
            "mandatory": mandatory
    };
    read_file.school_subjects[sub_name] = data;
    const update_file = JSON.stringify(read_file, null, 4);
    fs.writeFileSync(open_file, update_file);
};

function deleteSubject(sub_name: string){
    const open_file = 'Database/subjects.json';
    const read_file = openSubjects('Database/subjects.json', true);

};

function modifySubject(){
    
};

function openSubjects(file_name: string, return_value: boolean) {
    const file = fs.readFileSync(file_name, "utf-8");
    const loaded_file = JSON.parse(file);
    console.log(loaded_file);
    if (return_value === true) {
        return loaded_file;
    };
};


addNewSubject("polish", "classroom 158", true, 45);
openSubjects('Database/subjects.json', false);