import { db } from "../db/mongo.connect";
import { LinkObject } from "../index";

export const getAllLinks = async (): Promise<LinkObject[] | undefined> => {
    try{
        return await db.collection("links").find().toArray();
    }catch (err) {
        console.log(err);
    }
};

export const getLinkbyRedirect = async (param: string): Promise<LinkObject | undefined> => {
    try{
        const linkArr: LinkObject[] = await db.collection("links").find({ "shrinks.link": param }).toArray();
        return linkArr[0];
    }catch (err) {
        console.log(err);
    }
};

export const updateLink = async (obj: LinkObject) => {
    try{
        return await db.collection("links").replaceOne({ _id: obj._id }, { ...obj });
    }catch (err) {
        console.log(err);
    }
}