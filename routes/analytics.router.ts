import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

import { StatsObject, port, host } from "../index";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

interface CountObject {
    site: string;
    counter: number;
    visit_date?: string;
};

// interface FrequencyObject {
//     [key: string]: number;
// };

// const descending = (arr: LinkObject[], param: number): LinkObject[] =>
//     arr.sort((a, b): number => a.param - b.param).reverse();

// const getTopSites = (links: LinkObject[]): CountObject[] => {
//     let sites: string[] = [];
//     let siteFrequency: FrequencyObject = {};
//     links.forEach((item): void =>{
//         if (sites.includes(item.target.replace("https://", ""))) {
//             siteFrequency[item.target.replace("https://", "")]++
//         } else{
//             sites.push(item.target.replace("https://", "")); 
//             siteFrequency[item.target.replace("https://", "")] = 1;
//         }
//     });
//     return descending(Object.keys(siteFrequency)
//     .map((item): CountObject => ({name: item, counter: siteFrequency[item]})));
// };

// const getTopShrinked = (links:LinkObject[]): CountObject[] => {
//     let shrinks: CountObject[] = []
//     return descending(links.map((item, i): CountObject => shrinks[i] = {
//         name: item.shrinked, 
//         counter: item.visits
//     }));
// };

// const getLastVisited = (links:LinkObject[]): CountObject[] => {
//     let siteVisits: CountObject[] = []
//     return descending(links.map((item, i): CountObject => siteVisits[i] = {
//         name: item.shrinked, 
//         counter: item.last_visit_ms, 
//         visit_date: item.last_visit
//     }));
// };

// const filterCount = (fn: (links: StatsObject[]) => CountObject[], links: StatsObject[], param: string): CountObject[] => 
// fn(links).filter((item,i): CountObject | null => i<Number(param)? item : null);

// router.use((req: Request, _, next: NextFunction): void => {
//     let nomatch: boolean = true;
//     req.links.forEach((item):void => {
//         for (let obj of req.stats){
//             if (obj.site === item.target){
//                 nomatch = false;
//                 obj.clicks += item.visits;
//                 typeof obj.redirects !== "undefined" ? obj.redirects++ : obj.redirects = 1;
//                 if (obj.last_visit_ms < item.last_visit_ms){
//                     obj.last_visit = item.last_visit;
//                     obj.last_visit_ms = item.last_visit_ms;    
//                 }
//             }
//         }
//         nomatch ? req.stats.push({
//             site: item.target,
//             clicks: item.visits,
//             redirects: 1,
//             last_visit: item.last_visit,
//             last_visit_ms: item.last_visit_ms
//         }) : null
//     });
//     next();
// });

router.get("/most-redirected/", (req: Request, res: Response): void => {
    req.stats.sort((a: StatsObject, b: StatsObject): number => a.redirects - b.redirects).reverse();
    let mostRedirectedAll: CountObject[] = [];
    req.stats.forEach((item) => mostRedirectedAll.push({site: item.site, counter: item.redirects}));
    res.status(200).json(mostRedirectedAll);
});

router.get("/most-redirected/:count", (req: Request, res: Response): void => {
    req.stats.sort((a: StatsObject, b: StatsObject): number => a.redirects - b.redirects).reverse();
    let mostRedirectedAll: CountObject[] = [];
    req.stats.forEach((item) => mostRedirectedAll.push({site: item.site, counter: item.redirects}));
    let mostRedirected = mostRedirectedAll.filter((item,i): CountObject | null => 
    i<Number(req.params.count)? item : null)
    res.status(200).json(mostRedirected);
});

router.get("/most-visited", (req: Request, res: Response): void => {
    req.stats.sort((a: StatsObject, b: StatsObject): number => a.clicks - b.clicks).reverse();
    let mostVisitedAll: CountObject[] = [];
    req.stats.forEach((item) => mostVisitedAll.push({site: item.site, counter: item.clicks}));
    res.status(200).json(mostVisitedAll);
});

router.get("/most-visited/:count", (req: Request, res: Response): void => {
    req.stats.sort((a: StatsObject, b: StatsObject): number => a.clicks - b.clicks).reverse();
    let mostVisitedAll: CountObject[] = [];
    req.stats.forEach((item) => mostVisitedAll.push({site: item.site, counter: item.clicks}));
    let mostVisited = mostVisitedAll.filter((item,i): CountObject | null => 
    i<Number(req.params.count)? item : null)
    res.status(200).json(mostVisited);
});

router.get("/last-visited", (req: Request, res: Response): void => {
    req.stats.sort((a: StatsObject, b: StatsObject): number => a.last_visit_ms - b.last_visit_ms).reverse();
    let lastVisitedAll: CountObject[] = [];
    req.stats.forEach((item) => lastVisitedAll.push({site: item.site, counter: item.last_visit_ms, visit_date: item.last_visit}));
    res.status(200).json(lastVisitedAll);
});

router.get("/last-visited/:count", (req: Request, res: Response): void => {
    req.stats.sort((a: StatsObject, b: StatsObject): number => a.last_visit_ms - b.last_visit_ms).reverse();
    let lastVisitedAll: CountObject[] = [];
    req.stats.forEach((item) => lastVisitedAll.push({site: item.site, counter: item.last_visit_ms, visit_date: item.last_visit}));
    let lastVisited = lastVisitedAll.filter((item,i): CountObject | null => 
    i<Number(req.params.count)? item : null)
    res.status(200).json(lastVisited);
});

router.get("/:shrinked", (req: Request, res: Response): void => {
    req.links.forEach((item): void => {
        if (item.shrinked === req.params.shrinked){
            res.status(200).json(
                {
                    target: item.target,
                    shrinked: `http://${host}:${port}/${item.shrinked}`,
                    clicks: item.visits,
                    last_visit: item.last_visit
                }
            )
        }
    })
});

export default router;