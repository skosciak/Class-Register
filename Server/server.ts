import express from 'express';
import cors from 'cors';
import { addNewTeacher, removeTeacher, returnTeacherInfo, searchTeacher } from './teachers.js';

type returnedData = {
    data: object,
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
    console.log(`Incoming traffic from IP: ${req.ip} HOSTNAME: ${req.hostname}`);
    res.status(200).send('Server online');
});

type key = { id: string };

server.get('/teachers?:id', (req, res) => {

    let return_data: any;
    let return_array: returnedData[] = [];

    const query = req.query;
    if (!query) {
        return res.status(400).send('failed to received')
    };
    if (typeof query !== 'string') {
         return_data = searchTeacher(query);
    }
    else
        return_data = returnTeacherInfo(`${query}`);
        return_data.forEach(el => {
            return_array[return_array.length] = {
                id: el.id, 
                data: returnTeacherInfo(el.id)};
    });
    if (return_data.length === 0) 
        res.status(200).json('Did not found teacher. Please try again or try other search parameters.')
    else
        res.status(200).json(return_array);
});

server.post('/:database', (req, res) => {

    let return_data: any;
    let return_array: returnedData[] = [];

    const data = req.body;
    if (!data) {
        return res.status(400).send('Failed to received')
    };
    if ((typeof data.name === 'undefined') || (typeof data.surname === 'undefined') || (typeof data.subjects === 'undefined')) {
        console.log(`Cannot add new teacher`);
        return res.status(200).json(`Data received. Name, surname and at least one subject is mandatory!!!`);
    };
    return_data = searchTeacher(data);
    if (return_data.length !== 0) {
        return_data.forEach(el => {
            return_array[return_array.length] = {
                id: el.id, 
                data: returnTeacherInfo(el.id)};
        });
        return res.status(200).json(return_array);
    };
    const add_result: boolean = addNewTeacher(data);
    if (add_result === true) {
        console.log(`Added new teacher`);
        return res.status(200).json(`Data received. Added new teacher`);
    };
});

server.delete('/teachers', (req, res) => {
    let data = req.body || req.body.short_data;
    if (!data) {
        return res.status(400).send('failed to received')
    };
    if (data.method_checked === 'DELETE'){
        const teacher = searchTeacher(data)
        const finish: boolean = removeTeacher(teacher);
        console.log(`Removing teacher finished with status ${finish}`);
        res.status(200).send(`Data received. Removed teacher ${data.name, data.surname, data.age, data.subject}`);
    }
    else {
        res.status(200).send('Data received but did not specified method.')
    }
});

server.patch('/', (req, res) => {

});


server.listen(port);
console.log(`Listening on port ${port}`);