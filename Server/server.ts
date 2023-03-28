import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import { addNewTeacher, modifyTeacher, removeTeacher, returnTeacherInfo, searchTeacher } from './teachers.js';
import { addNewClassroom, modifyClassroom, removeClassroom, searchClassroom } from './classroom.js';
import { classroom, data_classroom, data_teacher, search, teacher } from './types.js';
import { searchForMatch } from './reusable.js';

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

server.get('/teachers?:id', (req: Request<never, never, data_teacher, never>, res: Response) => {

    let return_data: search;
    let return_array_perfect: Array<any> = [];
    let return_array_imperfect: Array<any> = [];

    const query: data_teacher = req.query;
    const search_type = query.search_type;

    if (!query) {
        return res.status(400).json({
            msg: 'failed to received',
            code: 0o0002
        });
    };

    if (typeof query !== 'string')
         return_data = searchTeacher(query);
    else
        return_data = returnTeacherInfo(`${query}`);

    if (Array.isArray(return_data.imperfect) || Array.isArray(return_data.perfect)){
        return_data.imperfect.forEach(el => {
            return_array_perfect[return_array_perfect.length] = {
                id: el.id, 
                data: returnTeacherInfo(el.id)};
        });
        return_data.perfect.forEach(el => {
            return_array_imperfect[return_array_imperfect.length] = {
                id: el.id, 
                data: returnTeacherInfo(el.id)};
        });
    };

    if (return_data.perfect.length === 0 && return_data.imperfect.length === 0) 
        return res.status(200).json({
            msg: 'Did not found teacher. Please try again or try other search parameters.',
            code: 0o0013
        })
    else
        if (search_type === 'perfect')
            return res.status(200).json({
                data: return_array_perfect,
                msg: 'Returning data',
                code: 0o0101
            });
        else 
            return res.status(200).json({
                data: return_array_imperfect,
                msg: 'Returning data',
                code: 0o0101
            });
});

server.post('/teachers', (req, res) => {

    const data: teacher = req.body.data_to_send;
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

    const return_data: search = searchTeacher(data);
    if (return_data.perfect.length === 0){
        if (return_data.imperfect.length === 0) {
            const finish: {status: boolean, id: string} = addNewTeacher(data);
            if (finish.status === true) {
                console.log(`Added new teacher with id ${finish.id}`);
                return res.status(200).json({
                    msg: `Data received. Added new teacher with id ${finish.id}`,
                    code: 0o0001
                });
            }
            else {
                console.log(`Something went wrong!`);
                return res.status(200).json({
                    msg: `Data received. But something went wrong. Cannot add teacher`,
                    code: 0o0002
                });
            }
        }
        else {
            const { name, surname } = data;
            let match: number = 0;
            return_data.imperfect.forEach(el => {
                el.data['name'] === name ? match++ : '';
                el.data['surname'] === surname ? match++ : '';
                if (match === 2) {
                    return res.status(200).json({
                        msg: `Data received. This teacher already exist!`,
                        code: 0o0002
                    });
                }
            });
            const finish: {status: boolean, id: string} = addNewTeacher(data);
            if (finish.status === true) {
                console.log(`Added new teacher with id ${finish.id}`);
                return res.status(200).json({
                    msg: `Data received. Added new teacher with id ${finish.id}`,
                    code: 0o0001
                });
            }
            else {
                console.log(`Something went wrong!`);
                return res.status(200).json({
                    msg: `Data received. But something went wrong. Cannot add teacher`,
                    code: 0o0002
                });
            }
        }
    }
    else {
        return res.status(200).json({
            msg: `Data received. This teacher already exist!`,
            code: 0o0002
        });
    };
    
});

server.delete('/teachers', (req, res) => {
    const data: teacher = req.body.data_to_send;
    if (!data) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };
    const teacher: search = searchTeacher(data);
    if (teacher.perfect.length === 0) {
        console.log('Data received but did not found teacher.')
        return res.status(200).json({
            msg: 'Data received but did not found teacher.',
            code: 0o0013
        });
    }
    else if (teacher.perfect.length === 1) {
        const finish: {status: boolean, data?: object, msg?: string} = removeTeacher(teacher.perfect[0]);
        console.log(`Removing teacher finished with status ${finish.status}`);
        if (finish.status === true){
            const {name, surname, age, subject} = data;
            return res.status(200).json({
                msg: `Data received. Removed teacher ${name === undefined ? '' : name}, ${surname === undefined ? '' : surname}, ${age === undefined ? '' : age}, ${subject === undefined ? '' : subject}`,
                code: 0o0001
            });
        }
        else {
            console.log('Data received but something went wrong!.')
            return res.status(200).json({
                msg: 'Data received but something went wrong!',
                code: 0o0002
            });
        };
    }
    else if (teacher.perfect.length > 1) {
        console.log('Multiple teachers with provided data found.')
        return res.status(200).json({
            msg: 'Multiple teachers with provided data found.',
            code: 0o0014
        });
    };
});

server.put('/teachers', (req, res) => {
    const data: teacher = req.body.data_to_send;
    const data_modify: teacher = req.body.data_to_modify;
    if (!data || !data_modify) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };
    const teacher = searchTeacher(data);
    if(teacher.perfect.length === 0) {
        return res.status(200).json({
            msg: 'Did not found teacher. Please try again or try other search parameters.',
            code: 0o0013
        });
    };
    if(teacher.perfect.length >= 2) {
        return res.status(200).json({
            msg: 'Cannot modify teacher. Found more than one match.',
            code: 0o0014
        });
    };
    const finish = modifyTeacher(data_modify, teacher.perfect[0].id);
    if (finish.status === false) {
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

server.get('/classrooms?:id', (req: Request<never, never, data_classroom, never>, res: Response) => {
    const query: data_classroom = req.query;
    const search_type: string = query.search_type;

    if(!query) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };
        
    const classrooms: search = searchClassroom(query);
    if (search_type === 'perfect'){
        if (classrooms.perfect.length !== 0) {
            return res.status(200).json({
                data: classrooms.perfect,
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
    }
    else {
        if (classrooms.imperfect.length !== 0) {
            return res.status(200).json({
                data: classrooms.imperfect,
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
});

server.post('/classrooms', (req, res) => {
    const data: classroom = req.body.data_to_send;
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
    let return_data: search = searchClassroom(data);
    if (return_data.perfect.length === 0) {
        if (return_data.imperfect.length === 0) {
            const finish: {status: boolean, id: string} = addNewClassroom(data);
            if (finish.status === true) {
                console.log(`Added new classroom with id ${finish.id}`);
                return res.status(200).json({
                    msg: `Data received. Added new classroom with id ${finish.id}`,
                    code: 0o0001
                });
            }
            else {
                console.log(`Something went wrong!`);
                return res.status(200).json({
                    msg: `Data received. But something went wrong. Cannot add classroom`,
                    code: 0o0002
                });
            };
        }
        else {
            const { classroom } = data;
            let match: number = 0;
            return_data.imperfect.forEach(el => {
                el.data['classroom'] === classroom ? match++ : '';
                if (match === 1) {
                    return res.status(200).json({
                        msg: `Data received. This classroom already exist!`,
                        code: 0o0002
                    });
                }
            });
            const finish: {status: boolean, id: string} = addNewClassroom(data);
            if (finish.status === true) {
                console.log(`Added new classroom with id ${finish.id}`);
                return res.status(200).json({
                    msg: `Data received. Added new classroom with id ${finish.id}`,
                    code: 0o0001
                });
            }
            else {
                console.log(`Something went wrong!`);
                return res.status(200).json({
                    msg: `Data received. But something went wrong. Cannot add classroom`,
                    code: 0o0002
                });
            }
        }
    }
    else {
        return res.status(200).json({
            msg: `Data received. This classroom already exist!`,
            code: 0o0002
        });
    };
});

server.delete('/classrooms', (req, res) => {
    const data: classroom = req.body.data_to_send;
    if (!data) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    }
    const classroom: search = searchClassroom(data);
    if (classroom.perfect.length === 0) {
        console.log('Data received but did not found classroom.')
        return res.status(200).json({
            msg: 'Data received but did not found classroom.',
            code: 0o0013
        });
    }
    else if (classroom.perfect.length === 1) {
        const finish: {status: boolean, data?: object, msg?: string} = removeClassroom(classroom.perfect[0]);
        console.log(`Removing classroom finished with status ${finish.status}`);
        if (finish.status === true){
            const {classroom, main_subject, max_people} = data;
            return res.status(200).json({
                msg: `Data received. Removed classroom ${classroom === undefined ? '' : classroom}, ${main_subject === undefined ? '' : main_subject}, ${max_people === undefined ? '' : max_people}.`,
                code: 0o0001
            });
        }
        else {
            console.log('Data received but something went wrong!.')
            return res.status(200).json({
                msg: 'Data received but something went wrong!',
                code: 0o0002
            });
        };
    }
    else if (classroom.perfect.length > 1) {
        console.log('Multiple classrooms with provided data found.')
        return res.status(200).json({
            msg: 'Multiple classrooms with provided data found.',
            code: 0o0014
        });
    };
});

server.put('/classrooms', (req, res) => {
    const data: classroom = req.body.data_to_send;
    const data_modify: classroom = req.body.data_to_modify;
    if (!data || !data_modify) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };
    const classroom = searchClassroom(data);
    if(classroom.perfect.length === 0) {
        return res.status(200).json({
            msg: 'Did not found classroom. Please try again or try other search parameters.',
            code: 0o0013
        });
    };
    if(classroom.perfect.length >= 2) {
        return res.status(200).json({
            msg: 'Cannot modify classroom. Found more than one match.',
            code: 0o0014
        });
    };
    const finish = modifyClassroom(data_modify, classroom.perfect[0].id);
    if (finish.status === false) {
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
})

server.listen(port);
console.log(`Listening on port ${port}`);