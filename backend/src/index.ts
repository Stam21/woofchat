import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {connectDB} from '../config/database';
import { WebSocketServer } from 'ws';

const app = express();
const wsServer = new WebSocketServer({noServer: true});
dotenv.config();
app.use(cors());

//Create server
const PORT = process.env.PORT;
const server = app.listen(PORT);

const connection = connectDB();
const jsonParser = bodyParser.json();


wsServer.on('connection', socket => {
    socket.on('message', message => {
        try {
          const parsedMessage = JSON.parse(message.toString());
          const { sender, body } = parsedMessage;
          console.log(`Received a message from ${sender}: ${body}`);
        } catch (error) {
          console.error('Error parsing the message:', error);
        }
      });
});

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request);
    });
});

app.post("/login",jsonParser, function (req, res) {
   
   try {
        res.set('Content-Type', 'application/json; charset=UTF-8')
        const username = req.body.body.username
        const password = req.body.body.password
        connection.query('SELECT pwd FROM users WHERE name=$1',[username]).then(async function(resu) {
            
            if (await bcrypt.compare(password,resu.rows[0]['pwd'])){
                return res.sendStatus(200);
            }
            else {
                return res.sendStatus(404)
            }
        
        });
    } catch (e) {
        console.log("error")
    }
});

app.post('/register',jsonParser, async function (req, res) {
    try {
        res.set('Content-Type', 'application/json; charset=UTF-8')
        const username = req.body.body.username
        const password = await bcrypt.hash(req.body.body.password, 10)
        connection.query('SELECT * FROM users WHERE name=$1',[username]).then(function(resu) {
            if (resu.rowCount === 0) {
                    connection.query(
                        `INSERT INTO "users" ("name", "pwd")  
                        VALUES ($1, $2)`, [username, password]); // sends queries
                    return res.sendStatus(200);
            }
            return res.sendStatus(404);
        });
        
        
    } catch (e) {
        console.log("error")
    }
})
