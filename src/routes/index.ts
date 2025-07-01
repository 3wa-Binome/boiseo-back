import { Router } from "express";
import authRouter from "./auth.route";
import usersRouter from "./users.route";
import suppliersRouter from "./suppliers.route";


const router = Router();

router.use('/auth', authRouter);

router.use('/users', usersRouter);

router.use('/suppliers', suppliersRouter);

export default router;