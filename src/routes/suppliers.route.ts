import { Router } from 'express';
import { suppliersController } from '../controllers';
import {  isAuthenticated, isOwner } from '../middlewares';
import { suppliers } from '../schemas';

const suppliersRouter = Router();

suppliersRouter.get("/", suppliersController.getAll);

suppliersRouter.get("/:id", isAuthenticated(true), isOwner(suppliers), suppliersController.get);

suppliersRouter.post("/", isAuthenticated(true), suppliersController.create);

suppliersRouter.put("/:id", isAuthenticated(true), isOwner(suppliers), suppliersController.update);

suppliersRouter.delete("/:id", isAuthenticated(true), isOwner(suppliers), suppliersController.delete);

export default suppliersRouter;