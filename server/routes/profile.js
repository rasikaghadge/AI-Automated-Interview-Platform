import express from 'express'
import { getProfiles, createProfile, updateProfile, deleteProfile, getProfile, getProfilesByUser } from '../controllers/profile.js'
import auth from '../middleware/auth.js';

const router = express.Router()
router.get('/all', getProfiles)
router.get('/:id', getProfile)
router.get('/userProfile', getProfilesByUser)
router.post('/', auth, createProfile)
router.patch('/:id', updateProfile)
router.delete('/:id', deleteProfile)


export default router