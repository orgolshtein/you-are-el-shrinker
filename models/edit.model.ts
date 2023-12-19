import { ObjectId } from "mongodb";
import { LinkObject } from "..";
import { db } from "../db/mongo.connect";

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