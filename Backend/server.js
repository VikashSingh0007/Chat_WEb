const express=require("express");
const app=express();
const User = require("./models/User"); 
const Message=require("./models/Message");
const userRoutes=require("./routes/userRoutes");
const rooms=['general','tech','finance','crypto'];
const cors=require("cors");
const { Socket } = require("socket.io");

app.use(express.urlencoded({extende:true}));
app.use(express.json());
app.use(cors());

app.use("/users",userRoutes) ; 
require("./connection");

 

const server=require('http').createServer(app);
const PORT=5001;
const io=require('socket.io')(server,{
    cors:{
        origin: 'http://localhost:3000',
        methods:['GET','POST']
    }
})



async function getLastMessagesFromRoom(room){
let roomMessages=await Message.aggregate([
    {$match:{to:(room)}},
    {$group:{id:"$date",messageByDate:{$push:"$$ROOT"}}}
])
return roomMessages;
}
function sortMessagesByDate(messages){
    return messages.sort(function(a,b){
        let date1=a_id.split("/");
        let date2=a_id.split("/");
        date1=date1[2]+date1[0]+date1[1];
        date2=date2[2]+date2[0]+date2[1];
        return date1<date2?-1:1;

    });
}

//socket connection
io.on("connection",(socket)=>{
    socket.on("new-user",async()=>{
        const members =await User.find();
        

    })


    socket.on("join-room",async(room)=>{
        socket.join(room);
        let roomMessages=await getLastMessagesFromRoom(room);
        roomMessages=sortMessagesByDate(roomMessages);
        socket.emit("room-messages",roomMessages);
    

    })
    socket.on("message-room",async(room,content,sender,time,date)=>{
        const newMessage=await Message.create({content,from:sender,time,date,to:room});
        let roomMessages=await getLastMessagesFromRoom(roomMessages);
        roomMessages=sortMessagesByDate(roomMessages);

        //sending message to room
        io.to(room).emit("roomMessages",roomMessages);
        socket.broadcast.emit("notifications",room);
         
    })
    app.delete("/logout",async(req,res)=>{
        try {
            const { _id ,newMessages}=req.body;
            const user=await User.findById(_id);
            user.status="offline";
            user.newMessages=newMessages;
            await user.save();
            const members=await User.find();
            socket.broadcast.emit("new-user",members);
            res.status(200).send();
        } catch (e) {
            console.log(e);
            res.status(400).send();
        }
    })
})

app.get("/rooms",(req,res)=>{
    res.json(rooms);
})

server.listen(PORT,()=>{
    console.log(`port is listening on ${PORT}`);
})
