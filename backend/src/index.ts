import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {connectDB} from '../config/database';

const app = express();
dotenv.config();
app.use(cors());

//Create server
const PORT = process.env.PORT;
app.listen(PORT, ():void => {
    console.log(`Server Running here 👉 ${process.env.HOST}:${PORT}`);
});

const connection = connectDB();




const jsonParser = bodyParser.json();

app.post("/login",jsonParser,function (req, res) {
   res.set('Content-Type', 'application/json; charset=UTF-8')
   const username = req.body.body.username
   const password = req.body.body.password
   try {
        connection.query('SELECT * FROM users WHERE name=$1 AND pwd=$2',[username,password]).then(function(resu) {
            if (resu.rowCount === 0) {
                return res.status(200).json({ authToken: "okay" });
            }
            else {
                const token =  process.env.ACCESS_TOKEN_SECRET;
                if (token) {
                    const access_token = jwt.sign({"username": username}, token, {expiresIn: '30s'})
                    return res.status(200).json({authToken: access_token});
                }
                else {
                    return res.status(200).json({authToken: undefined});
                } 

                
            }
        });
        
    } catch (e) {
        console.log("Failed to insert");
    }
});

app.post('/register',jsonParser, function (req, res) {
    res.set('Content-Type', 'application/json; charset=UTF-8')
    const username = req.body.body.username
    const password = req.body.body.password
    
    try {
        connection.query('SELECT * FROM users WHERE name=$1',[username]).then(function(resu) {
            if (resu.rowCount === 0) {
                    connection.query(
                        `INSERT INTO "users" ("name", "pwd")  
                        VALUES ($1, $2)`, [username, password]); // sends queries
            }
        });
        
    } catch (e) {
        console.log("Failed to insert");
    }
})
