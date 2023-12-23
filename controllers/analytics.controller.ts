import { StatsObject, LinkObject, host, port, RedirectObject } from "../index";
import { asyncHandler } from "../middleware/async.handler";
import * as links_model from "../models/links.model";

export const getAllLinks = asyncHandler(async (): Promise<LinkObject[] | undefined> => {
    return await links_model.getAllLinks();
});

export const getTopStats = (func: Function, type: string, links: LinkObject[] | undefined, param: string): StatsObject[] => 
func(type, links).filter((item: StatsObject, i: number): StatsObject | null => i<Number(param)? item : null);

export const getStats = (type: string, links: LinkObject[] | undefined): StatsObject[] => {
    let countArr: StatsObject[] = [];
    switch (type) {
        case "redirects":
            links?.forEach((link: LinkObject): void => {
                let count: number = link.shrinks.length;
                countArr.push({site: link.target, counter: count})
            })
            break;
        case "visits":
            links?.forEach((link: LinkObject): void => {
                let count: number = 0;
                link.shrinks.forEach((redirect: RedirectObject): void =>{
                    count += redirect.visits;
                })
                countArr.push({site: link.target, counter: count})
            })
            break;
        case "latest":
            links?.forEach((link): void => {
                let latest: number = 0;
                let latestSitesArr: number[] = [];
                link.shrinks.forEach((redirect): void =>{
                    latestSitesArr.push(redirect.last_visit_ms);
                    latest = Math.max(...latestSitesArr)
                })
                latest > 0 ?
                countArr.push({site: link.target, counter: latest, visit_date: new Date(latest).toString()}):
                countArr.push({site: link.target, counter: latest, visit_date: "None"})
            })
            break;
    }
    countArr.sort((a: StatsObject, b: StatsObject): number => 
    a.counter < b.counter ? -1 : b.counter > a.counter ? 1 : 0).reverse();
    return countArr;
};

export const getLinkStats = (links: LinkObject[] | undefined, no_match: boolean, param: string): StatsObject | boolean => {
    let linkObj: StatsObject = {};
    links?.forEach((link): void => {
        link.shrinks.forEach((item: RedirectObject): void =>{
            if (item.link === param) {
                no_match = false;
                linkObj = { target: link.target, ...item, link: `http://${host}:${port}/${item.link}` };
            }
        })
    });
    if (no_match){
        return no_match
    } else{
        return linkObj
    }
};