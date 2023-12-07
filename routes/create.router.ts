import { Router, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import { UrlObject, linksArray, writeToUrlData } from "../index";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.post("/", (req: Request, res: Response, next: NextFunction): void => {
  let err: Error = new Error("No input");
  next(err)
})

router.post("/:target", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      let randomHash: string = (Math.random() + 1).toString(36).substring(5);
      let newLinkObj: UrlObject = {
        id: linksArray.length+1, 
        target: `https://${req.params.target}`, 
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
  });
  
  router.post("/:target/:inner", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      let randomHash: string = (Math.random() + 1).toString(36).substring(5);
      let newLinkObj: UrlObject = {
        id: linksArray.length+1, 
        target: `https://${req.params.target}/${req.params.inner}`, 
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
  });
  
  router.post("/:target/:inner1/:inner2", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      let randomHash: string = (Math.random() + 1).toString(36).substring(5);
      let newLinkObj: UrlObject = {
        id: linksArray.length+1, 
        target: `https://${req.params.target}/${req.params.inner1}/${req.params.inner2}`, 
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
  });
  
  router.post("/:target/:inner1/:inner2/:inner3", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      let randomHash: string = (Math.random() + 1).toString(36).substring(5);
      let newLinkObj: UrlObject = {
        id: linksArray.length+1, 
        target: `https://${req.params.target}/${req.params.inner1}/${req.params.inner2}/${req.params.inner3}`, 
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
  });
  
  router.post("/:target/:inner1/:inner2/:inner3/:inner4", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      let randomHash: string = (Math.random() + 1).toString(36).substring(5);
      let newLinkObj: UrlObject = {
        id: linksArray.length+1, 
        target: `https://${req.params.target}/${req.params.inner1}/${req.params.inner2}/${req.params.inner3}/${req.params.inner4}`, 
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
  });
  
  router.post("/:target/:inner1/:inner2/:inner3/:inner4/:inner5", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      let randomHash: string = (Math.random() + 1).toString(36).substring(5);
      let newLinkObj: UrlObject = {
        id: linksArray.length+1, 
        target: `https://${req.params.target}/${req.params.inner1}/${req.params.inner2}/${req.params.inner3}/${req.params.inner4}/${req.params.inner5}`, 
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
  });

  export default router;