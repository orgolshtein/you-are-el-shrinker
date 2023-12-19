import { Router, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import * as edit_controller from "../controllers/edit.controller";
import { LinkObject } from "../index";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.patch("/:link", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      const linkObj: LinkObject | undefined = await edit_controller.editLink(req.params.link, req.body.new_link);
      linkObj !== undefined ? res.status(200).json(linkObj): res.status(404).send(req.no_path_err)
    } catch (err){
      next(err)
    }
  });
  
  router.delete("/delete/all/data", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      await edit_controller.deleteAllLinks();
      res.status(200).send("Data reset")
    } catch (err){
      next(err);
    }
  });

export default router;