import { Router, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import * as create_controller from "../controllers/create.controller";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

const createNewShrinked = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const newShrinked = await create_controller.createShrinked(req.params.target, req.params[0])
    res.json(newShrinked)
  } catch (err) {
    next(err)
  }
};

router.post("/", (req: Request, res: Response, next: NextFunction): void => {
  let err: Error = new Error("No input");
  next(err)
})

router.post("/:target", createNewShrinked);
  
router.post("/:target/*", createNewShrinked);

export default router;