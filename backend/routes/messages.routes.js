import express from 'express';
import { getMessages, createMessage } from '../controllers/messages.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.get('/:conversationId', getMessages);
router.post('/', createMessage); // why i am using this post

export default router;