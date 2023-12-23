import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

import * as analytics_controller from "../controllers/analytics.controller";
import { StatsObject } from "../index";
import { asyncRoute } from "../middleware/async.handler";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.use(asyncRoute(async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    req.links = await analytics_controller.getAllLinks();
    req.no_match = true;
    next();
}));

router.get("/most-redirected/", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getStats("redirects" ,req.links));
});

router.get("/most-redirected/:count", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getTopStats(analytics_controller.getStats, "redirects" ,req.links, req.params.count));
});

router.get("/most-visited", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getStats("visits" ,req.links));
});

router.get("/most-visited/:count", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getTopStats(analytics_controller.getStats, "visits" , req.links, req.params.count));
});

router.get("/last-visited", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getStats("latest" ,req.links));
});

router.get("/last-visited/:count", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getTopStats(analytics_controller.getStats, "latest" , req.links, req.params.count));
});

router.get("/:shrinked", asyncRoute(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const linkObj: StatsObject | boolean = await analytics_controller.getLinkStats(req.links, req.no_match, req.params.shrinked);
    typeof linkObj === "boolean" ? 
    res.status(404).send(req.no_path_err) : 
    res.status(200).json({target: linkObj.target, ...linkObj, link: linkObj.link});
}));

export default router;