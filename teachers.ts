import * as fs from 'fs';

function groupAllNewTeachers(){
    const open_file = 'Database/teachers.json';
    const read_file = openSubjects(open_file, true);
    const buffer_loop = read_file.teachers.unsorted.length;
    for (let i = 0; i < buffer_loop; i++) {
        const teacher_buffer = read_file.teachers.unsorted[0];
        const check_subjects_names = Object.getOwnPropertyNames(read_file.teachers);
        check_subjects_names.pop();
        let biggest_id: number = 0;
        let subject_name_present: string[] = [];
        check_subjects_names.forEach(el => {
            teacher_buffer.subjects.forEach((name: string) => {
                if(name === el)
                    subject_name_present[subject_name_present.length] = name;
            });
            read_file.teachers[el].forEach(identyficator =>{
                if(biggest_id < identyficator.id)
                    biggest_id = identyficator.id;
            });
        });
        teacher_buffer.id = biggest_id + 1;
        if (subject_name_present.length === 0){
            read_file.teachers[teacher_buffer.subjects[0]] = [teacher_buffer];
        }
        else{
            subject_name_present.forEach(el => {
                read_file.teachers[el][read_file.teachers[el].length] = teacher_buffer;
            });
        };
    
        read_file.teachers.unsorted.shift();
    };

    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return;
};

function addNewTeacher (name: string, surname: string, age: number, subjects: string[]) {
    if ((name === null || undefined) || (surname === null || undefined)) {
        console.warn("Name and surname is madatory!!!");
        return;
    };
    const open_file = 'Database/teachers.json';
    const read_file = openSubjects(open_file, true);
    const new_teacher = {
        "id": null,
        "name": name,
        "surname": surname,
        "age": age,
        "subjects": subjects
    };
    read_file.teachers.unsorted[read_file.teachers.unsorted.length] = new_teacher;
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
    return;
};

function modifyTeacher (only_perfect_match: boolean, name?: string, surname?: string, age?: number, subjects?: string[]) {
    let teacher = {
        "name": name,
        "surname": surname,
        "age": age,
        "subjects": subjects
    };
    for (const [key, value] of Object.entries(teacher)) {
        if (value === undefined || null)
            delete teacher[key];
    };
    if((Object.keys(teacher)).length === 0){
        console.warn("No values for search!");
        return false;
    }
    else if ((Object.keys(teacher)).length !== 4){
        console.warn("Search returning all matched results! Carefully change teachers data!")
    };
    const open_file = 'Database/teachers.json';
    const read_file = openSubjects(open_file, true);
    const found_teachers = searchTeacher("Joanna", "Koroniewska");
    if(only_perfect_match === true)
        delete found_teachers.unperfect_match;
    found_teachers.perfect_match.forEach(el =>{
        read_file.teachers[el.subject].forEach(array_element => {
            if (array_element.id === found_teachers.perfect_match[0].id){
                for (const key in teacher) {
                    array_element[key] = teacher[key];
                };
            };
        });
    });
    const update_file = JSON.stringify(read_file, null, "\t");
    fs.writeFileSync(open_file, update_file);
};

function searchTeacher(name?: string, surname?: string, age?: number, subjects?: string[]) {
    let teacher = {
        "name": name,
        "surname": surname,
        "age": age,
        "subjects": subjects
    };
    const open_file = 'Database/teachers.json';
    const read_file = openSubjects(open_file, true);
    for (const [key, value] of Object.entries(teacher)) {
        if (value === undefined || null)
            delete teacher[key];
    };
    if((Object.keys(teacher)).length === 0){
        console.warn("No values for search!");
        return false;
    };
    let matches_array = [];
    let count_matches:number = 0;
    let count:number = 0;
    let teacher_id: number = 0;
    let in_subject: string;
    for (const subject of Object.keys(read_file.teachers)) {                    //Entering subjects.
        for (const subject_iterator of read_file.teachers[subject]) {           //Entering subjects array with teachers.
            for (const teacher_key in teacher) {                                //Starting comparing teachers with entered keys.
                if(subject_iterator[teacher_key] === teacher[teacher_key]){     //Comparing teachers with keys entered by user.
                    console.log(`Found match in id ${subject_iterator.id}`);
                    count_matches++;                                            //Variable counting of how many entered keys match with our teacher database.
                    teacher_id = subject_iterator.id;
                    in_subject = subject;
                };
            };
            if (count_matches > 0){
                matches_array[count] = {
                    id: teacher_id,
                    count_matches: count_matches,
                    subject: in_subject
                };
                in_subject = undefined;
                teacher_id = 0;
                count_matches = 0;
                count++;
            };
        };
    };

    let perfect_match = [], unperfect_match = [];
    matches_array.forEach(el => {
        if (el.count_matches === (Object.keys(teacher)).length)
            perfect_match[perfect_match.length] = {
                id : el.id,
                subject : el.subject
            };
        else
            unperfect_match[unperfect_match.length] = {
                id : el.id,
                subject : el.subject
            };
    });

    return Object({
        perfect_match: perfect_match,
        unperfect_match: unperfect_match
    });  //returning ids of teachers for later use.
};

function openSubjects(file_name: string, return_value: boolean) {
    const file = fs.readFileSync(file_name, "utf-8");
    const loaded_file = JSON.parse(file);
    if (return_value === true) {
        return loaded_file;
    };
};

modifyTeacher(true, "Adam");
console.log("End of file");