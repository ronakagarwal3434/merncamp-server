import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { readdirSync } from "fs";

const morgan = require("morgan");
require("dotenv").config();

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    path: "/socket.io",
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-type"],
    },
});

// db
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected!"))
    .catch((err) => console.log("DB connection error", err));

// middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: [process.env.CLIENT_URL],
    })
);

// autoload routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// socket.io
// io.on("connect", (socket) => {
//     // console.log("SOCKET.IO => ", socket.id)
//     socket.on("send-message", (message) => {
//         // console.log("NEW MESSAGE RECEIVED => ", message);
//         socket.broadcast.emit("receive-message", message);
//     });
// });

io.on("connect", (socket) => {
    // console.log("SOCKET.IO => ", socket.id)
    socket.on("new-post", (newPost) => {
        // console.log("NEW POST SOCKETIO MESSAGE RECEIVED => ", newPost);
        socket.broadcast.emit("new-post", newPost);
    });
});

const port = process.env.PORT || 8000;
http.listen(port, () =>
    console.log(`Server is up and running on port: ${port}`)
);
