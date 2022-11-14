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
    delete read_file.school_subjects[sub_name];
    const update_file = JSON.stringify(read_file, null, 4);
    fs.writeFileSync(open_file, update_file);
};

function modifySubject(action: string, sub_name: string, sub_property: string, sub_value: any){
    const open_file = 'Database/subjects.json';
    const read_file = openSubjects('Database/subjects.json', true);
    let send_flag: boolean;
    if (action === "delete") {
        delete read_file.school_subjects[sub_name][sub_property];
        const update_file = JSON.stringify(read_file, null, 4);
    }
    else if(action === "modify") {
        switch (sub_property){
            case "class":
                if(typeof sub_value === "string"){
                    read_file.school_subjects[sub_name][sub_property] = sub_value;
                    send_flag = true;
                    break;
                }
                else{
                    console.warn(`Wrong property type. For ${sub_property} should be string`);
                    send_flag = false;
                    break;
                };

            case "lesson_hours":
                if(typeof sub_value === "number"){
                    read_file.school_subjects[sub_name][sub_property] = sub_value;
                    send_flag = true;
                    break;
                }
                else{
                    console.warn(`Wrong property type. For ${sub_property} should be number`);
                    send_flag = false;
                    break;
                };

            case "mandatory":
                if(typeof sub_value === "boolean"){
                    read_file.school_subjects[sub_name][sub_property] = sub_value;
                    send_flag = true;
                    break;
                }
                else{
                    console.warn(`Wrong property type. For ${sub_property} should be true/false`);
                    send_flag = false;
                    break;
                };
        };
        if (send_flag === true){
            const update_file = JSON.stringify(read_file, null, 4);
            fs.writeFileSync(open_file, update_file);
        };
    };
};

function openSubjects(file_name: string, return_value: boolean) {
    const file = fs.readFileSync(file_name, "utf-8");
    const loaded_file = JSON.parse(file);
    console.log(loaded_file);
    if (return_value === true) {
        return loaded_file;
    };
};

modifySubject("modify", "english", "class", "classroom 202");
addNewSubject("swedish", "classroom 158", true, 45);
openSubjects('Database/subjects.json', false);
deleteSubject("polish");
openSubjects('Database/subjects.json', false);