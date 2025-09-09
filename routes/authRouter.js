import express from 'express';
import { registerController, loginController, logoutController } from '../controllers/authControllers.js';
import authenticate from '../middlewares/authenticate.js';

const authRouter = express.Router();

authRouter.post('/register', registerController);

authRouter.post('/login', loginController);

authRouter.post('/logout', authenticate, logoutController);

export default authRouter;