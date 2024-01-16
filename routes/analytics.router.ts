import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

import * as analytics_controller from "../controllers/analytics.controller.js";
import { StatsObject } from "../index.js";
import { asyncRoute } from "../middleware/async.handler.js";
import { noPathHandler } from "../middleware/error.handler.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.use(asyncRoute(async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    req.links = await analytics_controller.getAllLinks();
    req.no_match = true;
    next();
}));

const getLinkStats = asyncRoute(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const linkObj: StatsObject | boolean = await analytics_controller.getLinkStats(
        req.links, 
        req.no_match, 
        req.params.shrinked, 
        req.params[0]
        );
    if (typeof linkObj === "boolean"){
        req.no_path_err = "Link not found";
        noPathHandler(req, res);
    } else{
        res.status(200).json({...linkObj});
    }
});

router.get("/most-redirected/", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getStats("redirects" ,req.links));
});

router.get("/most-redirected/:count", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getTopStats(
        analytics_controller.getStats, 
        "redirects",
        req.links, 
        req.params.count
        ));
});

router.get("/most-visited", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getStats("visits" ,req.links));
});

router.get("/most-visited/:count", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getTopStats(
        analytics_controller.getStats, 
        "visits", 
        req.links, 
        req.params.count
        ));
});

router.get("/last-visited", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getStats("latest" ,req.links));
});

router.get("/last-visited/:count", (req: Request, res: Response): void => {
    res.status(200).json(analytics_controller.getTopStats(
        analytics_controller.getStats, 
        "latest", 
        req.links, 
        req.params.count
        ));
});

router.get("/:shrinked", getLinkStats);

router.get("/:shrinked/*", getLinkStats);

export default router;