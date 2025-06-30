import { Router } from 'express';
import { usersController } from '../controllers';
import {  isAuthenticated } from '../middlewares';
import { users } from '../schemas';

const usersRouter = Router();

usersRouter.get("/", usersController.getAll);

export default usersRouter;