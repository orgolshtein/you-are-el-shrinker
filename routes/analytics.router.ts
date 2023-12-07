import { Router, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

export default router;