import express from 'express';
import { registerController, loginController, logoutController, getCurrentController } from '../controllers/authControllers.js';
import authenticate from '../middlewares/authenticate.js';

const authRouter = express.Router();

authRouter.post('/register', registerController);

authRouter.post('/login', loginController);

authRouter.post('/logout', authenticate, logoutController);

authRouter.get('/current', authenticate, getCurrentController);

export default authRouter;