import express from 'express';
import { register, login, getMe, logout, refreshToken } from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validation/auth.schema.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

export default router;