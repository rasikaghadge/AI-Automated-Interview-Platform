import express from 'express'
import { signin, signup, forgotPassword, refreshToken } from '../controllers/user.js'
import { auth } from "../middleware/auth.js";

const router = express.Router()

router.post('/signin', signin)
router.post('/signup', signup)
router.patch('/forgot', forgotPassword);
router.post('/refresh', refreshToken);


export default router