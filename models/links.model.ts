import { ObjectId } from "mongodb";

import { db } from "../db/mongo.connect";
import { LinkObject } from "../index";
import { asyncHandler } from "../middleware/async.handler";

export const getAllLinks = asyncHandler(async (): Promise<LinkObject[] | undefined> => {
    return await db.collection("links").find().toArray();
});

export const getLink = asyncHandler(async (
    prop: string, 
    get_by: string | null, 
    param?: string
    ): Promise<LinkObject | undefined> => {
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
});

export const updateLink = asyncHandler(async (obj: LinkObject): Promise<void> => {
    return await db.collection("links").replaceOne({ _id: obj._id }, { ...obj });
});

export const createLink = asyncHandler(async (link: LinkObject): Promise<void> => {
    return await db.collection("links").insertOne(link);
});

export const deleteAllLinks = asyncHandler(async (): Promise<void> => {
    return await db.collection("links").deleteMany({});
});