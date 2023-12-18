import { LinkObject } from "../index";
import { db } from "../db/mongo.connect";

export const getOneLink = async (target: string, param?: string): Promise<LinkObject> => {
    const links: any = await db.collection("links");
    let chosenLinkArr: LinkObject[];
    param ? 
        chosenLinkArr = await links.find({ target: `https://${target}/${param}`}).toArray() :
        chosenLinkArr = await links.find({ target: `https://${target}`}).toArray()
    const chosenLinkObj: LinkObject = chosenLinkArr[0]
    console.log(chosenLinkObj)
    return chosenLinkObj;
};

export const createShrinked = async (link: LinkObject): Promise<any> => {
    return await db.collection("links").insertOne(link);
};
