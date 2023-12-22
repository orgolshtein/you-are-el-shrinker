import { ObjectId } from "mongodb";

import { db } from "../db/mongo.connect";
import { LinkObject } from "../index";

export const getAllLinks = async (): Promise<LinkObject[] | undefined> => {
    try{
        return await db.collection("links").find().toArray();
    }catch (err) {
        console.log(err);
    }
};

export const getLink = async (prop: string, get_by: string | null, param?: string): Promise<LinkObject | undefined> => {
    try{
        let linkArr: LinkObject[];
        switch (get_by) {
            case "by_target":
                param ? 
                linkArr = await db.collection("links").find({ target: `https://${prop}/${param}`}).toArray() :
                linkArr = await db.collection("links").find({ target: `https://${prop}`}).toArray()
                break;
            case "by_id":
                linkArr = await db.collection("links").find({ "shrinks._id": new ObjectId(prop) }).toArray();
                break;
            default:
                linkArr = await db.collection("links").find({ "shrinks.link": prop }).toArray();
                break;
        }
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

export const deleteAllLinks = async (): Promise<void> => {
    try{
        return await db.collection("links").deleteMany({});
    } catch (err) {
        console.log(err)
    }
};