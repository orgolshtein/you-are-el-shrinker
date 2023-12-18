import { MongoClient, ServerApiVersion } from "mongodb";

export let db: any;

export const mongoConnect = async (uri: any, db_name: any): Promise<MongoClient> => {
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
};