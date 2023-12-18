import { Router, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import * as edit_controller from "../controllers/edit.controller";
import { LinkObject } from "../index";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.patch("/:shrinked", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      
    } catch (err){
      
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