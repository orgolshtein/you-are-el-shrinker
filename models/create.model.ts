import { LinkObject } from "../index";
import { db } from "../db/mongo.connect";

export const getLinkByTarget = async (target: string, param?: string): Promise<LinkObject | undefined> => {
    try{
        const links: any = await db.collection("links");
        let linkArr: LinkObject[];
        param ? 
            linkArr = await links.find({ target: `https://${target}/${param}`}).toArray() :
            linkArr = await links.find({ target: `https://${target}`}).toArray()
        return linkArr[0];
    } catch (err) {
        console.log(err)
    }
};

export const createLink = async (link: LinkObject): Promise<void> => {
    try{
        return await db.collection("links").insertOne(link);
    } catch (err) {
        console.log(err)
    }
};
