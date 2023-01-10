import express from 'express';
import cors from 'cors';
import { addNewTeacher, removeTeacher, returnTeacherInfo, searchTeacher } from './teachers.js';
const server = express();
const port = 5500;
server.use(express.static('public'));
server.use(express.json());
server.use(cors({
    'origin': '*',
    'methods': '*'
}));
server.get('/', (req, res) => {
    res.status(200).send('Server online');
});
server.get('/teachers?:id', (req, res) => {
    const query = req.query;
    let return_data;
    let return_array = [];
    if (!query) {
        return res.status(400).send('failed to received');
    }
    ;
    if (typeof query !== 'string') {
        return_data = searchTeacher(String(query.name));
    }
    else
        return_data = returnTeacherInfo(`${query}`);
    return_data.forEach(el => {
        return_array[return_array.length] = {
            id: el.id,
            data: returnTeacherInfo(el.id)
        };
    });
    res.status(200).json(return_array);
});
server.post('/:database', (req, res) => {
    const { database } = req.params;
    const data = req.body.data || req.body.short_data;
    if (!data) {
        return res.status(400).send('failed to received');
    }
    ;
    if (searchTeacher(data.name, data.surname, data.age, data.subjects)) {
        addNewTeacher(data.name, data.surname, data.subjects, data.age);
        console.log(`Added new teacher`);
        res.status(200).send(`Data received. Added new teacher`);
    }
    else {
        res.status(200).send('Data received but did not specified method.');
    }
});
server.delete('/teachers?:object', (req, res) => {
    const { object } = req.params;
    let query = req.query;
    let data = req.body.data || req.body.short_data;
    if (!data && !query) {
        return res.status(400).send('failed to received');
    }
    ;
    if ((data === null || data === void 0 ? void 0 : data.method_checked) === 'DELETE' || query) {
        if (!data) {
            data = query;
        }
        const finish = removeTeacher(searchTeacher(data.name, data.surname, data.age, data.subjects));
        if (typeof finish != 'boolean') {
            res.status(200).send(finish.id);
        }
        else {
            console.log(`Removing teacher finished with status ${finish}`);
            res.status(200).send(`Data received. Removed teacher ${data.name, data.surname, data.age, data.subject}`);
        }
        ;
    }
    else {
        res.status(200).send('Data received but did not specified method.');
    }
});
server.listen(port);
console.log(`Listening on port ${port}`);
//# sourceMappingURL=server.js.map