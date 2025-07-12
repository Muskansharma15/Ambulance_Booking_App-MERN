import express from 'express';
import { Signup, Login, getUserProfile, logoutuser, deleteUserProfile, editUserProfile } from '../controllers/authcontroller.js';
import authmiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);

router.get('/profile', authmiddleware, getUserProfile);
router.get('/logout', authmiddleware, logoutuser);
router.put("/profile", authmiddleware, editUserProfile);  
router.delete("/profile", authmiddleware, deleteUserProfile);  


export default router;
