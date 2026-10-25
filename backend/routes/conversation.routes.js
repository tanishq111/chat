import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import {
  createConversation,
  getConversations,
} from '../controllers/conversation.controller.js';

const router = express.Router();

router.use(protect);

router.post('/', createConversation);
router.get('/', getConversations);

export default router;