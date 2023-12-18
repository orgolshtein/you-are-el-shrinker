import { db } from "../db/mongo.connect";

export const deleteAllLinks = async (): Promise<any> => {
    return await db.collection("links").deleteMany({});
};