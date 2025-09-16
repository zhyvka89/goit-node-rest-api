import express from 'express';
import { registerController, loginController, logoutController, getCurrentController, uploadAvatarController } from '../controllers/authControllers.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const authRouter = express.Router();

authRouter.post('/register', registerController);

authRouter.post('/login', loginController);

authRouter.post('/logout', authenticate, logoutController);

authRouter.get('/current', authenticate, getCurrentController);
authRouter.patch('/avatars', authenticate, upload.single('avatar'), uploadAvatarController);

export default authRouter;