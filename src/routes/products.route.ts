import { Router } from 'express';
import { productsController } from '../controllers';
import {  isAuthenticated, isOwner } from '../middlewares';
import { products, users, categories } from '../schemas';

const productsRouter = Router();

productsRouter.get("/user/:id", isAuthenticated(true), isOwner(users), productsController.getAllByUser);

productsRouter.get("/categories/:id", isAuthenticated(true), isOwner(categories), productsController.getAllByCategory);

productsRouter.get("/:id", isAuthenticated(true), isOwner(products), productsController.get);

productsRouter.post("/", isAuthenticated(true), productsController.create);

productsRouter.put("/:action/:id", isAuthenticated(true), isOwner(products), productsController.updateQuantity);

productsRouter.put("/:id", isAuthenticated(true), isOwner(products), productsController.update);

productsRouter.delete("/:id", isAuthenticated(true), isOwner(products), productsController.delete);

export default productsRouter;