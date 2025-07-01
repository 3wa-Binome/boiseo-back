import { Router } from "express";
import { picturesController } from "../controllers";
import { isAuthenticated, isOwner } from "../middlewares";
import { pictures, users, products } from "../schemas";

const picturesRouter = Router();

picturesRouter.get("/product/:id", isAuthenticated(true), isOwner(products), picturesController.getAllByProduct);

picturesRouter.get("/:id", picturesController.get);

// picturesRouter.get("/", picturesController.getAll);

picturesRouter.post("/", isAuthenticated(true), picturesController.create);

picturesRouter.delete("/:id", isAuthenticated(true), isOwner(pictures), picturesController.delete);

export default picturesRouter;
