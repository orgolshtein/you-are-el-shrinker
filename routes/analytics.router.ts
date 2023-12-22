import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

import * as analytics_controller from "../controllers/analytics.controller";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.use(async (req: Request, _, next: NextFunction): Promise<void> =>{
    try{
      req.links = await analytics_controller.getAllLinks();
      req.no_match = true;
      next();
    }catch (err) {
      next(err)
    }
  });

router.get("/most-redirected/", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getAllRedirects(req.links));
});

router.get("/most-redirected/:count", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getTopRedirects(req.links, req.params.count));
});

router.get("/most-visited", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getAllVisits(req.links));
});

router.get("/most-visited/:count", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getTopVisits(req.links, req.params.count));
});

router.get("/last-visited", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getAllLastestVisits(req.links));
});

router.get("/last-visited/:count", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getLastestVisits(req.links, req.params.count));
});

router.get("/:shrinked", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const linkObj = await analytics_controller.getLinkStats(req.links, req.no_match, req.params.shrinked);
        linkObj === false ? 
        res.status(404).send(req.no_path_err) : 
        res.status(200).json({target: linkObj.target, ...linkObj, link: linkObj.link});
    }catch (err) {
        next(err)
    }
});

export default router;