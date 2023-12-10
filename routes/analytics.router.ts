import { Router, Request, Response } from "express";
import bodyParser from "body-parser";

import { linksArray } from "../index";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

interface FrequencyObject {
    [key: string]: number;
};

interface CountObject {
    name: string;
    count: number;
    visit_date?: string;
};

const descending = (arr: CountObject[]): CountObject[] =>
    arr.sort((a, b): number => a.count - b.count).reverse();

const getTopSites = (): CountObject[] => {
    let sites: string[] = [];
    let siteFrequency: FrequencyObject = {};
    linksArray.forEach((item): void =>{
        if (sites.includes(item.target.replace("https://", ""))) {
            siteFrequency[item.target.replace("https://", "")]++
        } else{
            sites.push(item.target.replace("https://", "")); 
            siteFrequency[item.target.replace("https://", "")] = 1;
        }
    });
    return descending(Object.keys(siteFrequency)
    .map((item): CountObject => ({name: item, count: siteFrequency[item]})));
};

const getTopShrinked = (): CountObject[] => {
    let shrinks: CountObject[] = []
    return descending(linksArray.map((item, i): CountObject => shrinks[i] = {
        name: item.shrinked, 
        count: item.visits
    }));
};

const getLastVisited = (): CountObject[] => {
    let siteVisits: CountObject[] = []
    return descending(linksArray.map((item, i): CountObject => siteVisits[i] = {
        name: item.shrinked, 
        count: item.last_visit_ms, 
        visit_date: item.last_visit
    }));
};

const filterCount = (fn: () => CountObject[], param: string): CountObject[] => 
fn().filter((item,i): CountObject | null => i<Number(param)? item : null);

router.get("/top-sites/", (_, res: Response): void => {
    let topSitesAll: CountObject[] = getTopSites();
    res.status(200).json(topSitesAll);
});

router.get("/top-sites/:count", (req: Request, res: Response): void => {
    let topSites: CountObject[] = filterCount(getTopSites, req.params.count)
    res.status(200).json(topSites);
});

router.get("/top-shrinked", (_, res: Response): void => {
    let topShrinkedAll: CountObject[] = getTopShrinked();
    res.status(200).json(topShrinkedAll);
});

router.get("/top-shrinked/:count", (req: Request, res: Response): void => {
    let topShrinked: CountObject[] = filterCount(getTopShrinked, req.params.count)
    res.status(200).json(topShrinked);
});

router.get("/last-visited", (_, res: Response): void => {
    let lastVisitedAll: CountObject[] = getLastVisited();
    res.status(200).json(lastVisitedAll);
});

router.get("/last-visited/:count", (req: Request, res: Response): void => {
    let lastVisited: CountObject[] = filterCount(getLastVisited, req.params.count);
    res.status(200).json(lastVisited);
});

router.get("/:shrinked", (req: Request, res: Response): void => {
    linksArray.forEach((item): void => {
        if (item.shrinked === req.params.shrinked){
            res.status(200).json(
                {
                    target: item.target,
                    shrinked: `http://localhost:3020/${item.shrinked}`,
                    clicks: item.visits,
                    last_visit: item.last_visit
                }
            )
        }
    })
});

export default router;