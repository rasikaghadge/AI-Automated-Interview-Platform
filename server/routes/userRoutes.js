import express from 'express'
import { signin, signup, forgotPassword, homepage, logOut } from '../controllers/user.js'
import { auth } from "../middleware/auth.js";

const router = express.Router()

router.post('/signin', signin)
router.post('/signup', signup)
router.patch('/forgot', forgotPassword);
router.get('/homepage', auth, homepage);
router.get('/logout', logOut);


export default router