import express from 'express';
import { register, login, profile, editProfile } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', profile);
router.put('/profile/edit', editProfile)


export default router
