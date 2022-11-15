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

    const update_file = JSON.stringify(read_file, null, 4);
    fs.writeFileSync(open_file, update_file);
    return;
};

function openSubjects(file_name: string, return_value: boolean) {
    const file = fs.readFileSync(file_name, "utf-8");
    const loaded_file = JSON.parse(file);
    console.log(loaded_file);
    if (return_value === true) {
        return loaded_file;
    };
};

groupAllNewTeachers();