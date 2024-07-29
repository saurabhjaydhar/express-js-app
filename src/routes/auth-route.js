
import express from 'express';
import {login,register,changePassword} from '../controllers/auth-controller.js';


 const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/change-password', changePassword);
export default authRouter

