import { Router } from 'express';
import { suppliersController } from '../controllers';
import {  isAuthenticated, isOwner } from '../middlewares';
import { suppliers, users } from '../schemas';

const suppliersRouter = Router();

suppliersRouter.get("/user/:id", isAuthenticated(true), isOwner(users), suppliersController.getAllByUser);

suppliersRouter.get("/:id", isAuthenticated(true), isOwner(suppliers), suppliersController.get);

// suppliersRouter.get("/", suppliersController.getAll);

suppliersRouter.post("/", isAuthenticated(true), suppliersController.create);

suppliersRouter.put("/:id", isAuthenticated(true), isOwner(suppliers), suppliersController.update);

suppliersRouter.delete("/:id", isAuthenticated(true), isOwner(suppliers), suppliersController.delete);

export default suppliersRouter;