import { Router, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import { UrlObject, linksArray, writeToUrlData } from "../index";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

const createNewShrinked = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    let randomHash: string = (Math.random() + 1).toString(36).substring(5);
    let newLinkObj: UrlObject = {
      id: linksArray.length+1, 
      target: req.params[0] ? `https://${req.params.target}/${req.params[0]}` : `https://${req.params.target}`, 
      shrinked: randomHash,
      visits: 0,
      last_visit: "None",
      last_visit_ms: 0
    }
    linksArray.push(newLinkObj);
    await writeToUrlData(linksArray);
    res.json(newLinkObj)
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