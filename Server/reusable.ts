import * as fs from 'fs';

export function openFile(file_name: string, return_value: boolean) {
    try {
        const file = fs.readFileSync(file_name, 'utf-8');
        const loaded_file = JSON.parse(file);
        if (return_value === true) {
            return loaded_file;
        };
    }
    catch {
        throw new Error(`File ${file_name} cannot be found`);
    };
};

export function searchIfKeyExist(inFile: string, key: string){
    const read_file = openFile(inFile, true);
    switch (Object.keys(read_file)[0]) {
        case 'classroom':
            if (read_file.classroom[key] === undefined)
                return false;
            return true;
    
        case 'teachers':
            if (read_file.teachers[key] === undefined)
                return false;
            return true;

        case 'school_subjects':
            if (read_file.school_subjects[key] === undefined)
                return false;
            return true;

        default:
            break;
    }
};