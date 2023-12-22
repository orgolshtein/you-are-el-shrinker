import { StatsObject, LinkObject, host, port, RedirectObject } from "../index";
import * as links_model from "../models/links.model";

export const getAllLinks = async (): Promise<LinkObject[] | undefined> => {
    try{
        return await links_model.getAllLinks();
    } catch (err){
        console.log(err);
    }
};

export const getAllRedirects = (links: LinkObject[] | undefined): StatsObject[] => {
    let countArr: StatsObject[] = [];
    links?.forEach((link: LinkObject): void => {
        let count: number = link.shrinks.length;
        countArr.push({site: link.target, counter: count})
    })
    countArr.sort((a: StatsObject, b: StatsObject): number => 
    a.counter < b.counter ? -1 : b.counter > a.counter ? 1 : 0).reverse();
    return countArr;
};

export const getTopRedirects = (links: LinkObject[] | undefined, param: string): StatsObject[] => 
getAllRedirects(links).filter((item: StatsObject, i: number): StatsObject | null => i<Number(param)? item : null);

export const getAllVisits = (links: LinkObject[] | undefined): StatsObject[] => {
    let countArr: StatsObject[] = [];
    links?.forEach((link: LinkObject): void => {
        let count: number = 0;
        link.shrinks.forEach((redirect: RedirectObject): void =>{
            count += redirect.visits;
        })
        countArr.push({site: link.target, counter: count})
    })
    countArr.sort((a: StatsObject, b: StatsObject): number => 
    a.counter < b.counter ? -1 : b.counter > a.counter ? 1 : 0).reverse();
    return countArr;
};

export const getTopVisits = (links: LinkObject[] | undefined, param: string): StatsObject[] => 
getAllVisits(links).filter((item: StatsObject, i: number): StatsObject | null => i<Number(param)? item : null);

export const getAllLastestVisits = (links: LinkObject[] | undefined): StatsObject[] => {
    let countArr: StatsObject[] = [];
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
    countArr.sort((a: StatsObject, b: StatsObject): number => 
    a.counter < b.counter ? -1 : b.counter > a.counter ? 1 : 0).reverse();
    return countArr;
};

export const getLastestVisits = (links: LinkObject[] | undefined, param: string): boolean | {} => 
getAllLastestVisits(links).filter((item: StatsObject, i: number): StatsObject | null => i<Number(param)? item : null);

export const getLinkStats = (links: LinkObject[] | undefined, no_match: boolean, param: string): any => {
    let linkObj: {} = {};
    links?.forEach((link): void => {
        link.shrinks.forEach((item: RedirectObject): any =>{
            if (item.link === param) {
                no_match = false;
                linkObj = { target: link.target, ...item, link: `http://${host}:${port}/${item.link}` };
            }
        })
    });
    if (no_match){
        return false
    } return linkObj
};