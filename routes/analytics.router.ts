import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

import { StatsObject, port, host } from "../index";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

interface CountObject {
    site: string;
    counter: string | number;
    visit_date?: string;
};

const getAllStats = (stats: StatsObject[], prop: keyof StatsObject, date_needed: boolean): CountObject[] => {
    stats.sort((a: StatsObject, b: StatsObject): number => 
    a[prop] < b[prop] ? -1 : b[prop] > a[prop] ? 1 : 0).reverse();
    let countArr: CountObject[] = [];
    stats.forEach((item): number => 
    date_needed ? countArr.push({site: item.site, counter: item[prop], visit_date: item.last_visit}) : 
    countArr.push({site: item.site, counter: item[prop]}));
    return countArr;
};

const getTopStats = (stats: StatsObject[], prop: keyof StatsObject, param: string, date_needed: boolean): CountObject[] => 
getAllStats(stats, prop, date_needed).filter((item,i): CountObject | null => i<Number(param)? item : null);

router.get("/most-redirected/", (req: Request, res: Response): void => {
    res.status(200).json(getAllStats(req.stats, "redirects", false));
});

router.get("/most-redirected/:count", (req: Request, res: Response): void => {
    res.status(200).json(getTopStats(req.stats, "redirects", req.params.count, false));
});

router.get("/most-visited", (req: Request, res: Response): void => {
    res.status(200).json(getAllStats(req.stats, "clicks", false));
});

router.get("/most-visited/:count", (req: Request, res: Response): void => {
    res.status(200).json(getTopStats(req.stats, "clicks", req.params.count, false));
});

router.get("/last-visited", (req: Request, res: Response): void => {
    res.status(200).json(getAllStats(req.stats, "last_visit_ms", true));
});

router.get("/last-visited/:count", (req: Request, res: Response): void => {
    res.status(200).json(getTopStats(req.stats, "last_visit_ms", req.params.count, true));
});

router.get("/:shrinked", (req: Request, res: Response): void => {
    req.nomatch = true;
    req.links.forEach((item): void => {
        if (item.shrinked === req.params.shrinked) {
            req.nomatch = false;
            res.status(200).json({...item, shrinked: `http://${host}:${port}/${item.shrinked}`});
        }
    })
    req.nomatch ? res.status(404).send(req.nopatherr) : null
});

export default router;