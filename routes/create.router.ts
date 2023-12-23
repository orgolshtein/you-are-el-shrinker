import { Router, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import * as create_controller from "../controllers/create.controller";
import { RedirectObject } from "../index";
import { asyncRoute } from "../middleware/async.handler";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

const createLink = asyncRoute(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const newLink: RedirectObject | undefined  = await create_controller.createLink(req.params.target, req.params[0])
  newLink !== undefined ? res.status(200).json({_id: newLink._id, output: newLink.output}): res.status(404).send(req.no_path_err);
});

router.post("/", (req: Request, res: Response, next: NextFunction): void => {
  const err: Error = new Error("No input");
  next(err)
})

router.post("/:target", createLink);
  
router.post("/:target/*", createLink);

export default router;