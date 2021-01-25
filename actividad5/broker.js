const carrito = require('./carrito2.js');
const zmq = require('zeromq');

var clients = [];
let s = zmq.socket('rep');
s.bind('tcp://*:8000');

s.on('message', (cliente, op, prod) => {
    console.log("client "+cliente);
    console.log("op "+op);
    console.log("prod "+prod);
    executeReq(cliente.toString(), op.toString(), prod.toString());
    s.send('Done');
});


executeReq =  function(client, action, obj){
    console.log("TODO: "+action+" "+obj);
    switch (action){
        case "add" :
            console.log("adding...");
            if (!clients.includes(client)){
                clients.push(client);
                carrito.comprobarYanadir(obj, client.toString(), false);
            }
            else carrito.comprobarYanadir(obj, client.toString(), true );
            break;
        case "remove" :
            console.log("removing..");
            if (!clients.includes(client)){
                clients.push(client);
                carrito.quitarYupdate(obj, client.toString(), false);
            }
            else carrito.quitarYupdate(obj, client.toString(), true);
            break;
        default:
            console.log("error");
            break;
    }
    
}
