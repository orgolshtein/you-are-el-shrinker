import { Router, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import * as edit_controller from "../controllers/edit.controller";
import { RedirectObject } from "../index";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.patch("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      const redirectObj: RedirectObject | boolean | undefined = await edit_controller.editLink(req.params.id, req.body.new_link);
      redirectObj === false ?
      res.status(500).send("Path is already in use") :
      redirectObj !== undefined && typeof redirectObj !== "boolean"? 
      res.status(200).json({_id: redirectObj._id, output: redirectObj.output}): 
      res.status(404).send(req.no_path_err)
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