import { WebSocketServer } from "ws";
import {v4 as uuid} from "uuid";


const clients = {};

const messages = [];
let wss = new WebSocketServer({port:8000});


wss.on('connection', (event) => {

    
    let id = uuid();
    clients[id] = event;

    console.log(`New client ${id} has connected`);

    event.on('message', (data) => {

        let {nameInput: name, messageInput: message} = JSON.parse(data);;

        messages.push({name, message});

        for (let client of Object.values(clients)) {
            client.send(JSON.stringify([{name, message}]));
        }
        
    })

    event.on('close', () => {

        delete clients[id];
        console.log(`User ${id} has disconnected`);

    })

})