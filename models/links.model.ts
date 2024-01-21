import { ObjectId } from "mongodb";

import { db } from "../db/mongo.connect.js";
import { LinkObject } from "../index.js";
import { asyncHandler } from "../middleware/async.handler.js";

export const getAllLinks = asyncHandler(async (): Promise<LinkObject[] | undefined> => {
    return await db.collection("links").find().toArray();
});

export const getLink = asyncHandler(async (
    prop: string, 
    get_by: string | null
    ): Promise<LinkObject | undefined> => {
    let linkArr: LinkObject[];
    switch (get_by) {
        case "by_target":
            linkArr = await db.collection("links").find({ target: prop}).toArray()
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

export const createLink = asyncHandler(async (link: LinkObject): Promise<void> => {
    return await db.collection("links").insertOne(link);
});

export const updateLink = asyncHandler(async (obj: LinkObject): Promise<void> => {
    return await db.collection("links").replaceOne({ _id: obj._id }, { ...obj });
});