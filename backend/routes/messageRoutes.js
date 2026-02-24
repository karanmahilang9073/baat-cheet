import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getMessages } from '../controllers/messageController.js';

const router = express.Router();

// GET /api/message/:conversationId
router.get('/:conversationId', authMiddleware, getMessages);

export default router;