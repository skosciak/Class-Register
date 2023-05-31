import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import { addNewTeacher, modifyTeacher, removeTeacher, searchTeacher } from './teachers.js';
import { addNewClassroom, modifyClassroom, removeClassroom, searchClassroom } from './classroom.js';
import { classroom, data_classroom, data_subject, data_teacher, search, subject, teacher } from './types.js';
import { returnInfo } from './reusable.js';
import { addNewSubject, removeSubject, searchSubject } from './subjects.js';

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
    const query: data_teacher = req.query;
    const search_type = query.search_type;
    let return_array_perfect: Array<any> = [];
    let return_array_imperfect: Array<any> = [];

    if (!query) {
        return res.status(400).json({
            msg: 'failed to received',
            code: 0o0002
        });
    };

    const return_data: search = searchTeacher(query);
    if (Array.isArray(return_data.imperfect) || Array.isArray(return_data.perfect)){
        return_data.imperfect.forEach(el => {
            return_array_perfect[return_array_perfect.length] = {
                id: el.id, 
                data: returnInfo(el.id, 'teachers')};
        });
        return_data.perfect.forEach(el => {
            return_array_imperfect[return_array_imperfect.length] = {
                id: el.id, 
                data: returnInfo(el.id, 'teachers')};
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
    let return_array_perfect: Array<any> = [];
    let return_array_imperfect: Array<any> = [];

    if(!query) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };
        
    const return_data: search = searchClassroom(query);
    if (Array.isArray(return_data.imperfect) || Array.isArray(return_data.perfect)){
        return_data.imperfect.forEach(el => {
            return_array_perfect[return_array_perfect.length] = {
                id: el.id, 
                data: returnInfo(el.id, 'classrooms')};
        });
        return_data.perfect.forEach(el => {
            return_array_imperfect[return_array_imperfect.length] = {
                id: el.id, 
                data: returnInfo(el.id, 'classrooms')};
        });
    };
    if (return_data.perfect.length === 0 && return_data.imperfect.length === 0) 
        return res.status(200).json({
            msg: 'Did not found classroom. Please try again or try other search parameters.',
            code: 0o0013
        })
    else {
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
});

server.get('/subjects?:id', (req: Request<never, never, data_subject, never>, res: Response) => {
    const query: data_subject = req.query;
    const search_type: string = query.search_type;
    let return_array_perfect: Array<any> = [];
    let return_array_imperfect: Array<any> = [];

    if(!query) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };
        
    const return_data: search = searchSubject(query);
    if (Array.isArray(return_data.imperfect) || Array.isArray(return_data.perfect)){
        return_data.imperfect.forEach(el => {
            return_array_perfect[return_array_perfect.length] = {
                id: el.id, 
                data: returnInfo(el.id, 'subjects')};
        });
        return_data.perfect.forEach(el => {
            return_array_imperfect[return_array_imperfect.length] = {
                id: el.id, 
                data: returnInfo(el.id, 'subjects')};
        });
    };
    if (return_data.perfect.length === 0 && return_data.imperfect.length === 0) 
        return res.status(200).json({
            msg: 'Did not found subject. Please try again or try other search parameters.',
            code: 0o0013
        })
    else {
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
    };
});

server.post('/subjects', (req, res) => {
    const data: subject = req.body.data_to_send;
    if (!data) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };
    Object.keys(data).forEach(key => {
        key ?? function() {
            console.log(`Cannot add new subject`);
            return res.status(200).json({
                msg: `Data received. The subject lesson, class, lesson_hours, and mandatory are required!!!`,
                code: 0o0011
            });
        }();
    });
    let return_data: search = searchSubject(data);
    if (return_data.perfect.length === 0) {
        if (return_data.imperfect.length === 0) {
            const finish: {status: boolean, id: string} = addNewSubject(data);
            if (finish.status === true) {
                console.log(`Added new subject with id ${finish.id}`);
                return res.status(200).json({
                    msg: `Data received. Added new subject with id ${finish.id}`,
                    code: 0o0001
                });
            }
            else {
                console.log(`Something went wrong!`);
                return res.status(200).json({
                    msg: `Data received. But something went wrong. Cannot add subject`,
                    code: 0o0002
                });
            };
        }
        else {
            const { lesson, classroom } = data;
            let match: number = 0;
            return_data.imperfect.forEach(el => {
                el.data['lesson'] === lesson ? match++ : '';
                el.data['classroom'] === classroom ? match++ : '';
                if (match === 2) {
                    return res.status(200).json({
                        msg: `Data received. This subject already exist!`,
                        code: 0o0002
                    });
                }
            });
            const finish: {status: boolean, id: string} = addNewSubject(data);
            if (finish.status === true) {
                console.log(`Added new subject with id ${finish.id}`);
                return res.status(200).json({
                    msg: `Data received. Added new subject with id ${finish.id}`,
                    code: 0o0001
                });
            }
            else {
                console.log(`Something went wrong!`);
                return res.status(200).json({
                    msg: `Data received. But something went wrong. Cannot add subject`,
                    code: 0o0002
                });
            };
        };
    }
    else {
        return res.status(200).json({
            msg: `Data received. This subject already exist!`,
            code: 0o0002
        });
    };
});

server.delete('/subjects', (req, res) => {
    const data: subject = req.body.data_to_send;
    if (!data) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };
    const subject: search = searchSubject(data);
    if (subject.perfect.length === 0) {
        console.log('Data received but did not found subject.')
        return res.status(200).json({
            msg: 'Data received but did not found subject.',
            code: 0o0013
        });
    }
    else if (subject.perfect.length === 1) {
        const finish: {status: boolean, data?: object, msg?: string} = removeSubject(subject.perfect[0]);
        console.log(`Removing subject finished with status ${finish.status}`);
        if (finish.status === true){
            const { lesson, classroom, lesson_hours, mandatory} = data;
            return res.status(200).json({
                msg: `Data received. Removed subject ${lesson === undefined ? '' : lesson}, ${classroom === undefined ? '' : classroom}, ${lesson_hours === undefined ? '' : lesson_hours}, ${mandatory === undefined ? '' : mandatory}`,
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
    else if (subject.perfect.length > 1) {
        console.log('Multiple teachers with provided data found.')
        return res.status(200).json({
            msg: 'Multiple teachers with provided data found.',
            code: 0o0014
        });
    };
});

server.put('/subjects', (req, res) => {
    const data: subject = req.body.data_to_send;
    const data_modify: subject = req.body.data_to_modify;
    if (!data || !data_modify) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    };
    const subject = searchSubject(data);
    if(subject.perfect.length === 0) {
        return res.status(200).json({
            msg: 'Did not found subject. Please try again or try other search parameters.',
            code: 0o0013
        });
    };
    if(subject.perfect.length >= 2) {
        return res.status(200).json({
            msg: 'Cannot modify subject. Found more than one match.',
            code: 0o0014
        });
    };
    const finish = modifyClassroom(data_modify, subject.perfect[0].id);
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

server.listen(port);
console.log(`Listening on port ${port}`);
