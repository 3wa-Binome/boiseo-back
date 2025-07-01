import { Router } from 'express';
import { categoriesController } from '../controllers';
import {  isAuthenticated, isOwner } from '../middlewares';
import { categories, users } from '../schemas';

const categoriesRouter = Router();

categoriesRouter.get("/user/:id", isAuthenticated(true), isOwner(users), categoriesController.getAllByUser);

categoriesRouter.get("/:id", isAuthenticated(true), isOwner(categories), categoriesController.get);

// categoriesRouter.get("/", categoriesController.getAll);

categoriesRouter.post("/", isAuthenticated(true), categoriesController.create);

categoriesRouter.put("/:id", isAuthenticated(true), isOwner(categories), categoriesController.update);

categoriesRouter.delete("/:id", isAuthenticated(true), isOwner(categories), categoriesController.delete);

export default categoriesRouter;