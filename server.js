const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io');
const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), "conf.json")));
let users = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(process.cwd(), "public")));
app.use("/node_modules", express.static(path.join(process.cwd(), "node_modules")));

const server = http.createServer(app);
const io = new Server(server);
server.listen(config.port, () => {
    console.log("server running on port: " + config.port);
});
io.on('connection', (socket) => {
    console.log("socket connected: " + socket.id);
    socket.on('message', (message) => {
        const response = (users.find(user => user.socketID == socket.id).name) + ': ' + message;
        console.log(response);
        io.emit("chat", response);
    });
    socket.on("isLogged", (username) => {
        users.push({ socketID: socket.id, name: username });
        io.emit("list", users);
        console.log(users)
    })
    socket.on("disconnect", () => {
        users = users.filter(user => user.socketID != socket.id)
        io.emit("list", users);
        console.log("socket disconnected: " + socket.id);
    })
});