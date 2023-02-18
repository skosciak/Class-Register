import express from 'express';
import cors from 'cors';
import { addNewTeacher, modifyTeacher, removeTeacher, returnTeacherInfo, searchTeacher } from './teachers.js';
const server = express();
const port = 5500;
server.use(express.static('public'));
server.use(express.json());
server.use(cors({
    'origin': '*',
    'methods': '*'
}));
server.get(`/server_status`, (req, res) => {
    console.log(`${Date()} Incoming traffic from IP: ${req.ip} HOSTNAME: ${req.hostname}`);
    return res.status(200).json({
        msg: 'Server online',
        code: 0o0001
    });
});
server.get('/teachers?:id', (req, res) => {
    let return_data;
    let return_array = [];
    const query = req.query;
    if (!query) {
        return res.status(400).json({
            msg: 'failed to received',
            code: 0o0002
        });
    }
    ;
    if (typeof query !== 'string') {
        return_data = searchTeacher(query);
    }
    else
        return_data = returnTeacherInfo(`${query}`);
    if (Array.isArray(return_data))
        return_data.forEach(el => {
            return_array[return_array.length] = {
                id: el.id,
                data: returnTeacherInfo(el.id)
            };
        });
    if (return_data.length === 0)
        return res.status(200).json({
            msg: 'Did not found teacher. Please try again or try other search parameters.',
            code: 0o0013
        });
    else
        return res.status(200).json({
            data: return_array,
            msg: 'Returning data',
            code: 0o0101
        });
});
server.post('/:database', (req, res) => {
    let return_data;
    let return_array = [];
    const data = req.body.data_to_send;
    if (!data) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    }
    ;
    if ((typeof data.name === 'undefined') || (typeof data.surname === 'undefined') || (typeof data.subjects === 'undefined')) {
        console.log(`Cannot add new teacher`);
        return res.status(200).json({
            msg: `Data received. Name, surname and at least one subject is mandatory!!!`,
            code: 0o0011
        });
    }
    ;
    return_data = searchTeacher(data);
    if (return_data.length !== 0) {
        return_data.forEach(el => {
            return_array[return_array.length] = {
                id: el.id,
                data: returnTeacherInfo(el.id)
            };
        });
        return res.status(200).json({
            data: return_array,
            msg: `Found teacher with same parameters.`,
            code: 0o0101
        });
    }
    ;
    const add_result = addNewTeacher(data);
    if (add_result.status === true) {
        console.log(`Added new teacher`);
        return res.status(200).json({
            msg: `Data received. Added new teacher with id ${add_result.id}`,
            code: 0o0001
        });
    }
    ;
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
        delete data.method_check;
        delete data.database_check;
        const teacher = searchTeacher(data);
        const finish = removeTeacher(teacher);
        console.log(`Removing teacher finished with status ${finish}`);
        if (finish === true) {
            return res.status(200).json({
                msg: `Data received. Removed teacher ${data.name}, ${data.surname}, ${data.age}, ${data.subject}`,
                code: 0o0001
            });
        }
        else {
            console.log('Data received but did not specified method.');
            return res.status(200).json({
                msg: 'Data received but did not specified method.',
                code: 0o0012
            });
        }
        ;
    }
    ;
});
server.put('/teachers', (req, res) => {
    const data = req.body.data_to_send;
    const data_modify = req.body.data_to_modify;
    if (!data && !data_modify) {
        return res.status(400).json({
            msg: 'Failed to received',
            code: 0o0002
        });
    }
    ;
    const teacher = searchTeacher(data);
    if (teacher.length === 0) {
        return res.status(200).json({
            msg: 'Did not found teacher. Please try again or try other search parameters.',
            code: 0o0013
        });
    }
    ;
    if (teacher.length >= 2) {
        return res.status(200).json({
            msg: 'Cannot modify teacher. Found more than one match.',
            code: 0o0014
        });
    }
    ;
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
    }
    ;
});
server.listen(port);
console.log(`Listening on port ${port}`);
//# sourceMappingURL=server.js.map