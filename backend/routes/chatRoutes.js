import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { createConversation, getConversation, getUsers } from '../controllers/chatController.js'

const chatRouter = express.Router()

chatRouter.get('/',authMiddleware,getConversation)
chatRouter.get('/users',authMiddleware,getUsers)
chatRouter.post('/create-chat',authMiddleware,createConversation)

export default chatRouter;