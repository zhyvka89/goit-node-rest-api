import express from 'express';

const authRouter = express.Router();

authRouter.post('/register', registerController);

authRouter.post('/login', loginController);

export default authRouter;