import { db } from "../db/mongo.connect";
import { LinkObject } from "../index";

export const getAllLinks = async (): Promise<LinkObject[]> => {
    const links: any = await db.collection("links");
    return await links.find().toArray();
};

export const getOneLink = async (param: string): Promise<LinkObject> => {
    const chosenLinkArr: LinkObject[] = await db.collection("links").find({ "shrinks.link": param }).toArray();
    const chosenLinkObj: LinkObject = chosenLinkArr[0]
    return chosenLinkObj;
};

export const updateOne = async (obj: LinkObject) => {
    return await db.collection("links").replaceOne({ _id: obj._id }, { ...obj });
}