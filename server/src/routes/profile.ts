import express from 'express'
import { getProfiles, updateProfile, deleteProfile, getProfile, getProfilesBySearch, selfProfile } from '../controllers/profile.js'
import { auth } from '../middleware/auth.js';

const router = express.Router()
router.get('/',auth, selfProfile);
router.get('/all', getProfiles)
router.get('/search', getProfilesBySearch)
router.get('/:id', auth, getProfile)
router.patch('/', auth, updateProfile)
router.delete('/', auth, deleteProfile)


export default router