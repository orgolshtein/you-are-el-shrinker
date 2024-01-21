import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

import * as create_controller from "../controllers/create.controller.js";
import { RedirectObject } from "../index.js";
import { asyncRoute } from "../middleware/async.handler.js";
import { noPathHandler } from "../middleware/error.handler.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.post("/", asyncRoute(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.body.target.length === 0){
    req.no_path_err = "No input";
    noPathHandler(req, res);
  } else {
    const newLink: RedirectObject | undefined  = await create_controller.createLink(
      req.body.target
      )
    newLink !== undefined ? 
    res.status(200).json({_id: newLink._id, output: newLink.output}): 
    (err: Error) => next(err);
  }
}));

export default router;