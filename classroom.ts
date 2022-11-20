import * as fs from 'fs';
import { openFile } from './reusable';

function addClassroom(number: string, main_subjects: string[], max_people?: number) {
    const open_file = 'Database/classroom.json';
    const read_file = openFile(open_file, true);
    if (checkIfClassroomExist(number)){
        console.warn('Classroom exist! Could not add new classroom.');  
        return false;
    }
    else if (isNaN(parseInt(number))){
        console.warn('Entered non numerical value for classroom number!');  
        return false;
    };

    const classroom = {
            "max_people": max_people,
            "main_subjects": main_subjects
    };
    if (classroom.max_people === undefined || null)
        delete classroom.max_people;
    read_file.classroom[number]= classroom;
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
};

function removeClassroom(number: string) {
    const open_file = 'Database/classroom.json';
    const read_file = openFile(open_file, true);
    if (checkIfClassroomExist(number)){
        console.warn('Classroom does not exist!');  
        return false;
    }
    else if (isNaN(parseInt(number))){
        console.warn('Entered non numerical value for classroom number!');  
        return false;
    };
    delete read_file.classroom[number];
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
};

function modifyClassroom(number: string, main_subjects?: string[], max_people?: number) {
    const open_file = 'Database/classroom.json';
    const read_file = openFile(open_file, true);
    if (!checkIfClassroomExist(number)){
        console.warn('Could not modify non existing classroom');  
        return false;
    }
    else if (isNaN(parseInt(number))){
        console.warn('Entered non numerical value for classroom number!');  
        return false;
    };
    const classroom = {
        "max_people": max_people,
        "main_subjects": main_subjects
    };
    if (classroom.max_people === undefined || null)
        delete classroom.max_people;
    try {
        if (classroom.main_subjects.length === 0)
            delete classroom.main_subjects;
    }
    catch {
        if (classroom.main_subjects === undefined || null)
            delete classroom.main_subjects;
    };
    if ((Object.keys(classroom)).length === 0){
        console.warn('Nothing to modify!!!');
        return false;
    };
    for (const key in classroom) {
        read_file.classroom[number][key] = classroom[key]; 
    };
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
};

function searchClassroom(main_subjects?: string[] ,max_people?: number, number?: string) {
    const open_file = 'Database/classroom.json';
    const read_file = openFile(open_file, true);
    let subject_array: boolean;
    if (number !== undefined || null){
        console.log(number, read_file.classroom[number]);
        return true;
    }
    else {
        const classroom = {
            "max_people": max_people,
            "main_subjects": main_subjects
        }; 
        if (classroom.max_people === undefined || null)
            delete classroom.max_people;
        try {
            if (classroom.main_subjects.length === 0)
                delete classroom.main_subjects;
            else 
                subject_array = true;
        }
        catch {
            if (classroom.main_subjects === undefined || null)
                delete classroom.main_subjects;
        };
        if ((Object.keys(classroom)).length === 0){
            console.warn('Nothing to seatch!!!');
            return false;
        };
        const matched_classroom = [];
        let count_matches: number = 0;
        for (const classroom_number in read_file.classroom) {
            if(subject_array === true) {
                classroom.main_subjects.forEach(subject => {
                    read_file.classroom[classroom_number].main_subjects.find(el => {
                        if(subject === el)
                            count_matches++;
                    });
                });
                if (read_file.classroom[classroom_number].max_people === classroom.max_people)
                    count_matches++;
                if (count_matches !== ((Object.keys(classroom)).length - 1) + classroom.main_subjects.length)
                    count_matches = 0;
                else {
                    matched_classroom[matched_classroom.length] = classroom_number;
                    count_matches = 0;
                }
            }
            else {
                for (const key in read_file.classroom[classroom_number]) {
                    if (read_file.classroom[classroom_number][key] === classroom[key]){
                        matched_classroom[matched_classroom.length] = classroom_number;
                    }
                }
            };
        };
        console.log(matched_classroom);
    };

};

function checkIfClassroomExist(number: string) {
    const open_file = 'Database/classroom.json';
    const read_file = openFile(open_file, true);
    for (const key in read_file.classroom) {
        if(number === key)
            return true;
    };
    return false;
};

console.log("End of file");