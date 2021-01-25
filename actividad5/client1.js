//client 1

const zmq = require('zeromq');
let s = zmq.socket('req');
s.connect('tcp://127.0.0.1:8000');
s.send([1, 'add', 'hierros']);
s.on('message', (msg) => {
    console.log('Request received: '+msg)
    s.close()
})
