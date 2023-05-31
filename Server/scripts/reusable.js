import * as fs from 'fs';
export function openFile(file_name, return_value) {
    try {
        const file = fs.readFileSync(file_name, 'utf-8');
        const loaded_file = JSON.parse(file);
        if (return_value === true) {
            return loaded_file;
        }
        ;
    }
    catch (_a) {
        throw new Error(`File ${file_name} cannot be found`);
    }
    ;
}
;
export function searchIfKeyExist(inFile, key) {
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
    ;
}
;
export function searchForMatch(database, data_object, data_to_search) {
    let match = 0;
    const perfect_match_array = [];
    const imperfect_match_array = [];
    let array_present;
    if (data_to_search['subject'] && Array.isArray(data_to_search['subject']))
        array_present = {
            array: true,
            length: data_to_search['subject'].length
        };
    else
        array_present = {
            array: false
        };
    for (const data_key in data_object) {
        if (Object.keys(data_object[data_key]).length >= Object.keys(data_to_search).length) {
            for (const search_key in data_to_search) {
                if (data_object[data_key][search_key] === data_to_search[search_key])
                    match++;
            }
            ;
            if (database === 'teachers' && array_present.array && Array.isArray(data_object[data_key]['subject'])) {
                const temp_match = match;
                match = 0;
                data_object[data_key]['subject'].forEach((el) => {
                    data_to_search['subject'].includes(el) ? match++ : '';
                });
                if (array_present.length <= match)
                    match = temp_match + 1;
                else
                    match = temp_match;
            }
            if (database === 'teachers' && array_present.array === false && data_object[data_key]['subject']) {
                const temp_match = match;
                match = 0;
                data_object[data_key]['subject'].includes(data_to_search['subject']) ? match = temp_match + 1 : match = temp_match;
            }
            if (match === Object.keys(data_to_search).length)
                perfect_match_array.push({
                    id: data_key,
                    data: data_object[data_key]
                });
            if (match >= 1)
                imperfect_match_array.push({
                    id: data_key,
                    data: data_object[data_key]
                });
        }
        ;
        match = 0;
    }
    ;
    return { perfect: perfect_match_array, imperfect: imperfect_match_array };
}
;
export function returnFirstFreeID(database) {
    const open_file = `./Server/Database/${database}.json`;
    const read_file = openFile(open_file, true);
    let last_id = 0;
    let id = 0;
    for (const key in read_file[database]) {
        id = Number(String(key).slice(3));
        if (id > last_id) {
            last_id = id;
        }
        ;
    }
    ;
    for (let i = 1; i < (last_id + 2); i++) {
        if (read_file[database][`id_${i}`] === undefined || null)
            return `id_${i}`;
    }
}
;
export function returnInfo(id, database) {
    const open_file = `./Server/Database/${database}.json`;
    const read_file = openFile(open_file, true);
    return read_file[database][id];
}
;
console.log('Loaded reusables module');
//# sourceMappingURL=reusable.js.map