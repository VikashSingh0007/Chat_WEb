const express = require("express");
const app = express();
const User = require("./models/User");
const Message = require("./models/Message");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// CORS configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Update with your production client URL
    methods: ['GET', 'POST'],
};

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/users", userRoutes);
app.get("/rooms", (req, res) => {
    res.json(rooms);
});

// Database connection
require("./connection");

const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions
});

const PORT = process.env.PORT || 5001;

// Socket.io event handling
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("new-user", async () => {
        const members = await User.find();
        io.emit("new-user", members);
    });

    socket.on("join-room", async (newRoom, previousRoom) => {
        socket.join(newRoom);
        socket.leave(previousRoom);
        let roomMessages = await getLastMessagesFromRoom(newRoom);
        roomMessages = sortRoomMessagesByDate(roomMessages);
        socket.emit("room-messages", roomMessages);
    });

    socket.on("message-room", async (room, content, sender, time, date) => {
        const newMessage = await Message.create({ content, from: sender, time, date, to: room });
        let roomMessages = await getLastMessagesFromRoom(room);
        roomMessages = sortRoomMessagesByDate(roomMessages);
        io.to(room).emit("room-messages", roomMessages);
        socket.broadcast.emit("notifications", room);
    });

    app.delete("/logout", async (req, res) => {
        try {
            const { _id, newMessages } = req.body;
            const user = await User.findById(_id);
            user.status = "offline";
            user.newMessages = newMessages;
            await user.save();
            const members = await User.find();
            socket.broadcast.emit("new-user", members);
            res.status(200).send();
        } catch (e) {
            console.error(e);
            res.status(400).send();
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

async function getLastMessagesFromRoom(room) {
    let roomMessages = await Message.aggregate([
        { $match: { to: room } },
        { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } }
    ]);
    return roomMessages;
}

function sortRoomMessagesByDate(messages) {
    return messages.sort((a, b) => {
        const date1 = a._id.split("/").reverse().join(""); // Format as YYYYMMDD
        const date2 = b._id.split("/").reverse().join(""); // Format as YYYYMMDD
        return date1 < date2 ? -1 : 1;
    });
}

module.exports = app;
