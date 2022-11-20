import * as fs from 'fs';

export function openFile(file_name: string, return_value: boolean) {
    const file = fs.readFileSync(file_name, "utf-8");
    const loaded_file = JSON.parse(file);
    if (return_value === true) {
        return loaded_file;
    };
};