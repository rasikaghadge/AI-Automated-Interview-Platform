import express from 'express'
import { signin, signup, forgotPassword } from '../controllers/user.js'

const router = express.Router()

router.post('/signin', signin)
router.post('/signup', signup)
router.patch('/forgot', forgotPassword);

export default router