import { db } from "../db/mongo.connect";
import { ObjectId } from "mongodb";
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

export const updateLink = async (obj: LinkObject) => {
    try{
        return await db.collection("links").replaceOne({ _id: obj._id }, { ...obj });
    }catch (err) {
        console.log(err);
    }
};


export const createLink = async (link: LinkObject): Promise<void> => {
    try{
        return await db.collection("links").insertOne(link);
    } catch (err) {
        console.log(err)
    }
};

export const getLinkbyId = async (id: string): Promise<LinkObject | undefined> => {
    try{
        const linkArr: LinkObject[] = await db.collection("links").find({ "shrinks._id": new ObjectId(id) }).toArray();
        return linkArr[0];
    }catch (err) {
        console.log(err);
    }
};

export const deleteAllLinks = async (): Promise<any> => {
    return await db.collection("links").deleteMany({});
};