import { MongoClient, ServerApiVersion } from "mongodb";
import { asyncHandler } from "../middleware/async.handler";

export let db: any;

export const mongoConnect = asyncHandler(async (uri: string, db_name: string): Promise<MongoClient> => {
    const client: MongoClient = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(db_name);
    return db;
});