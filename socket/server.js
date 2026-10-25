import express from 'express';
import { createServer } from 'node:http';
import path from 'node:path';
import { Server } from 'socket.io';
import cors from 'cors';


 const app = express();
 const httpServer = createServer(app);
 const io = new Server(httpServer); // used http server for socket.io- watches to upgrade the connection from HTTP to WebSocket
 // createServer.listen(3001) to start the server on port 3001-> app.listen(3001,()=>{ console.log('Server is running on http://localhost:3001'); })

// Absolute so the server works no matter which folder you launch it from.
app.use(express.static(path.join(import.meta.dirname, 'public')));
app.use(cors());
//  io.on('connection', (socket) => {
//    console.log('A user connected:', socket.id);

//    socket.on('disconnect', () => {
//      console.log('A user disconnected:', socket.id);
//    });
//  });


// socket.io is recerivne means when i get a message "message:send" => what function clal i need to trigger
// io.emit / socket.emit -> publishing end -> at clinet -> there will be someone who will be listeing to it like socket.on('message:new', callback)

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('message:send', (text) => { // on -> receive whenever a client send me this messgae
        io.emit('message:new', {  // on<->emit
            id: crypto.randomUUID(),
            from: socket.id.slice(0, 4),
            text,
            at: Date.now(),
        });
    });

    socket.on('echo', (text) => {
        console.log(`Echo from ${socket.id}: ${text}`);
        socket.emit('echo:reply', `server heard: ${text}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

httpServer.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});