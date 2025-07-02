import { Router } from 'express';
import { usersController } from '../controllers';
import {  isAuthenticated, isOwner } from '../middlewares';
import { users } from '../schemas';

const usersRouter = Router();

usersRouter.get("/:id", isAuthenticated(true), isOwner(users), usersController.get);

usersRouter.put("/:id", isAuthenticated(true), isOwner(users), usersController.update);

usersRouter.delete("/:id", isAuthenticated(true), isOwner(users), usersController.delete);

export default usersRouter;