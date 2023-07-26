import PG from 'pg';

export function connectDB() {
    // Database configuration
const connection = new PG.Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.NAME_DB,
    password: process.env.PWD_DB,
    port: Number(process.env.PORT_DB),
})
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to DB!");
});

return connection;
}