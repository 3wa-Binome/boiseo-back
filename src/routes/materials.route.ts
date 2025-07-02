import { Router } from 'express';
import { materialsController } from '../controllers';
import {  isAuthenticated, isOwner } from '../middlewares';
import { materials, users } from '../schemas';

const materialsRouter = Router();

materialsRouter.get("/user/:id", isAuthenticated(true), isOwner(users), materialsController.getAllByUser);

materialsRouter.get("/:id", isAuthenticated(true), isOwner(materials), materialsController.get);

materialsRouter.post("/", isAuthenticated(true), materialsController.create);

materialsRouter.put("/:id", isAuthenticated(true), isOwner(materials), materialsController.update);

materialsRouter.delete("/:id", isAuthenticated(true), isOwner(materials), materialsController.delete);

export default materialsRouter;