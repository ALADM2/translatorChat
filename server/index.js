import express from 'express'
import logger from 'morgan'

import { Server } from 'socket.io'
import { createServer } from 'http' 
import conn from "./db/connection.js";
import dotenv from 'dotenv'

import Message from "./models/chat.js"

dotenv.config();

const port = process.env.PORT || 3000

const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});

io.on('connection', async (socket) => {
    console.log('a user has connected!')

    socket.on('disconnect', () => {
        console.log('a user has disconnected')
    })

    socket.on('chat message', async (msg) => {
        let result;
        try{
            result = await Message.create({
                text: msg,
            });

            io.emit('chat message', msg)

        }catch(e){
            console.log(e)
            return
        }
    })

    console.log(socket.handshake.auth.serverOffset)
    if(!socket.recovered) {
        try{
            const offset = socket.handshake.auth.serverOffset || 0;
            console.log("Offset: " + offset)
            const results = await Message.find({
                id: { $gt: offset }
            });
            results.forEach(row => {
                socket.emit('chat message', row.text, row.id)
            });
        }catch(e){
            console.log(e);
        }
    } 
})

app.use(logger('dev'))

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
})

const start = async () => {
    await conn();
    server.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

start();

export {app, start}