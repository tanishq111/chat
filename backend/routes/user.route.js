import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import { searchUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', protect, searchUsers);

export default router;
