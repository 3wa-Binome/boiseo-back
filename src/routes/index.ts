import { Router } from "express";
import authRouter from "./auth.route";
import usersRouter from "./users.route";
import suppliersRouter from "./suppliers.route";
import materialsRouter from "./materials.route";
import categoriesRouter from "./categories.route";


const router = Router();

router.use('/auth', authRouter);

router.use('/users', usersRouter);

router.use('/suppliers', suppliersRouter);

router.use('/materials', materialsRouter);

router.use('/categories', categoriesRouter);

export default router;