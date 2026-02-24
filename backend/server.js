import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import Message from './models/Message.js'
import Conversation from './models/Conversation.js'



dotenv.config()

const app = express()

app.use(cors({
    origin : "http://localhost:5173",
    credentials :  true
}))

const PORT = process.env.PORT || 7000

connectDB()

app.use(express.json())

//routes
app.use('/api/auth',authRoutes)//user route
app.use('/api/chat',chatRouter)//chat route
app.use('/api/message',messageRoutes)  //message route

const server = http.createServer(app)

//socket initialization
const io = new Server(server, {
    cors : {
        origin : "*",
        methods : ["GET","POST"]
    }
})

io.on('connection',(socket)=>{
    console.log('user connected: ', socket.id)

    //join conversation
    socket.on('join-conversation', (conversationId)=>{
        const roomName = `conversation_${conversationId}`
        socket.join(roomName)
        console.log(`socket ${socket.id} joined ${roomName}`)
    })


    //send message
    socket.on('send-message', async ({ conversationId, text, sender }) => {
        try {
            const newMessage = await Message.create({
                conversationId,
                text,
                sender: typeof sender == 'object' ? sender._id : sender // Ensure we store just the ID
            });

            await Conversation.findByIdAndUpdate(conversationId,{
                latestMessage : newMessage._id,
                udatedAt : new Date()
            })
            
            // Populate sender info so frontend can display username immediately
            await newMessage.populate('sender', 'username avatar');

            const messageToSend = {
                _id: newMessage._id,
                conversationId,
                text,
                sender: newMessage.sender, // Send full populated user object
                createdAt: newMessage.createdAt
            }

            // Emit to everyone in the room
            io.to(`conversation_${conversationId}`).emit('new-message', messageToSend)
            
        } catch (error) {
            console.error("Socket save message error:", error);
        }
    })

    //leave conversation room
    socket.on('leave-conversation',(conversationId)=>{
        const roomName = `conversation_${conversationId}`
        socket.leave(roomName)
        console.log(`socket ${socket.id} left ${roomName}`)
    })

    socket.on('disconnect',()=>{
        console.log('user disconnected: ', socket.id)
    })
})

//test route
app.get("/", (req,res)=>{
    res.send("backend running successfully")
})

server.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})