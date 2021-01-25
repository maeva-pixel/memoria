//client2

const zmq = require('zeromq');
const client_id = 1;
let s = zmq.socket('req');
s.connect('tcp://127.0.0.1:8000');
s.send([client_id, 'remove','hierros']);
s.on('message', (msg) => {
    console.log('Request received: '+msg);
    s.close();
})



