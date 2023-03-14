import express from 'express';
import cors from 'cors';
import { addNewTeacher, modifyTeacher, removeTeacher, returnTeacherInfo, searchTeacher } from './teachers.js';
import { addClassroom, removeClassroom, searchClassroom } from './classroom.js';

type returnedData = {
    data: Array<object>,
    id: string
};

const server = express();
const port: number = 5500;

server.use(express.static('public'));
server.use(express.json());
server.use(cors({
        'origin': '*',
        'methods': '*'
    })); 

server.get(`/server_status`, (req, res) => {
    console.log(`${Date()}. Incoming traffic from IP: ${req.ip} HOSTNAME: ${req.hostname}`);
    return res.status(200).json({
        msg: 'Server online',
        code: 0o0001
    });
});

type key = { id: string };

server.get('/teachers?:id', (req, res) => {

    let return_data: string | Array<key>;
    let return_array: Array<returnedData> = [];

    const query: object = req.query;

    if (!query) {
        return res.status(400).json({
            msg: 'failed to received',
            code: 0o0002
        });
    };

    if (typeof query !== 'string')
         return_data = searchTeacher(query) as Array<key>;
    else
        return_data = returnTeacherInfo(`${query}`);

    if (Array.isArray(return_data))
        return_data.forEach(el => {
            return_array[return_array.length] = {
                id: el.id, 
                data: returnTeacherInfo(el.id)};
        });
    if (return_data.length === 0) 
        return res.status(200).json({
            msg: 'Did not found teacher. Please try again or try other search parameters.',
            code: 0o0013
        })
    else
        return res.status(200).json({
            data: return_array,
            msg: 'Returning data',
            code: 0o0101
        });
});

server.get('/classrooms?:id', (req, res) => {
    const query: object = req.query;
    if(!query) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };

    if(query) {
        const classrooms: Array<object> = searchClassroom(query);
        if (classrooms.length !== 0) {
            return res.status(200).json({
                data: classrooms,
                msg: 'Returning data.',
                code: 0o1001
            });
        }
        else {
            return res.status(200).json({
                msg: 'Data received. Did not found classroom with mathing result.',
                code: 0o0021
            })
        }
    };

    return res.status(200).json({
        msg: 'Succesfull, but nothing happens.',
        code: 0o0003
    });
});

server.post('/teachers', (req, res) => {

    let return_data: { id: string; }[];
    let return_array: Array<returnedData> = [];

    const data = req.body.data_to_send;
    if (!data) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };
    if ((typeof data.name === 'undefined') || (typeof data.surname === 'undefined') || (typeof data.subject === 'undefined')) {
        console.log(`Cannot add new teacher`);
        return res.status(200).json({
            msg: `Data received. Name, surname and at least one subject are mandatory!!!`,
            code: 0o0011
        });
    };
    return_data = searchTeacher(data);
    if (return_data.length !== 0) {
        return_data.forEach((el: { id: string; }) => {
            return_array[return_array.length] = {
                id: el.id, 
                data: returnTeacherInfo(el.id)};
        });
        return res.status(200).json({
            data: return_array,
            msg: `Found teacher with same or similar parameters.`,
            code: 0o0101
        });
    };
    const add_result: {status: boolean, id: string} = addNewTeacher(data);
    if (add_result.status === true) {
        console.log(`Added new teacher`);
        return res.status(200).json({
            msg: `Data received. Added new teacher with id ${add_result.id}`,
            code: 0o0001
        });
    };
});

server.post('/classrooms', (req, res) => {
    const data: {classroom?: number, max_people?: number, main_subject?: string} = req.body.data_to_send;
    let return_data: {id: string; data: {classroom: string, 'max-people': number, 'main-subject': string}}[];
    let status: boolean | {status: boolean, msg: string};
    if (!data) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };
    if (typeof data.classroom === undefined || typeof data.max_people === undefined) {
        console.log(`Cannot add new classroom`);
        return res.status(200).json({
            msg: `Data received. Classroom number and max people count are mandatory!!!`,
            code: 0o0011
        });
    };
    return_data = searchClassroom(data);
    switch (return_data.length) {
        case 0:
            status = addClassroom(data);
            if (status === true) {
                console.log(`Added new teacher`);
                return res.status(200).json({
                    msg: `Data received. Added new class with number ${data.classroom}`,
                    code: 0o0001
                });
            }
            else {
                return res.status(200).json({
                    msg: status.msg,
                    code: 0o0002
                });
            }
    
        default:
            return_data.forEach(el => {
                if (Number(el.data.classroom) === data.classroom)
                    return res.status(200).json({
                        data: return_data,
                        msg: `Found classroom with same parameters.`,
                        code: 0o0101
                    });
            });
            status = addClassroom(data)
            if (status === true)
                return res.status(200).json({
                    msg: `Found classroom with similar parameters but with diffrent classroom number. Classroom added!`,
                    code: 0o0101
                });
            else
                return res.status(200).json({
                    msg: `Unsuccesfull.`,
                    code: 0o0002
                });
    };
    
});

server.delete('/teachers', (req, res) => {
    const data = req.body.data_to_send;
    if (!data) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    }
    else {
        const teacher = searchTeacher(data);
        const finish: boolean = removeTeacher(teacher);
        console.log(`Removing teacher finished with status ${finish}`);
        if (finish === true){
            return res.status(200).json({
                msg: `Data received. Removed teacher ${data.name}, ${data.surname}, ${data.age}, ${data.subject}`,
                code: 0o0001
            });
        }
        else {
            console.log('Data received but did not specified method.')
            return res.status(200).json({
                msg: 'Data received but did not specified method.',
                code: 0o0012
            });
        };
    };
});

server.delete('/classrooms', (req, res) => {
    type classroom_search = {
        id: string,
        data: {
            number: number,
            max_people: number,
            main_subject: string
        }
    }
    const data: {classroom?: number, max_people?: number, main_subject?: string} = req.body.data_to_send;
    if (!data) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    }
    else {
        const classroom: classroom_search[] = searchClassroom(data);
        if (classroom.length === 1){
            const status: boolean | {status: boolean, msg: string} = removeClassroom(classroom[0].data.number);
            if (status === true) {
                return res.status(200).json({
                    msg: `Data received. Removed classroom with number ${data.classroom}`,
                    code: 0o0001
                });
            }
            else {
                return res.status(200).json({
                    msg: `Ops! Something went wrong!`,
                    code: 0o6666
                });
            }
        }
        else {
            return res.status(200).json({
                data: classroom,
                msg: "Cannot remove teacher. Found few classrooms with similar parameters.",
                code: 0o0022
            });
        }
    };
});

server.put('/teachers', (req, res) => {
    const data = req.body.data_to_send;
    const data_modify = req.body.data_to_modify;
    if (!data || !data_modify) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };
    const teacher = searchTeacher(data);
    if(teacher.length === 0) {
        return res.status(200).json({
            msg: 'Did not found teacher. Please try again or try other search parameters.',
            code: 0o0013
        });
    };
    if(teacher.length >= 2) {
        return res.status(200).json({
            msg: 'Cannot modify teacher. Found more than one match.',
            code: 0o0014
        });
    };
    const state = modifyTeacher(data_modify, teacher[0].id);
    if (state === false) {
        return res.status(200).json({
            msg: 'Unsuccesfull.',
            code: 0o0002
        });
    }
    else {
        return res.status(200).json({
            msg: 'Succesfull.',
            code: 0o0002
        });
    };
});

server.put('/classrooms', (req, res) => {
    const data = req.body.data_to_send;
    const data_modify = req.body.data_to_modify;
    if (!data || !data_modify) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };
    const classroom: object[] = searchClassroom(data);
    if (classroom.length === 1) {
        
    }
})

server.listen(port);
console.log(`Listening on port ${port}`);