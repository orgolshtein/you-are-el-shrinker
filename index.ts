import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser  from "body-parser";
import { ObjectId } from "mongodb";

import { mongoConnect } from "./db/mongo.connect";
import createRouter from "./routes/create.router";
import editRouter from "./routes/edit.router";
import analyticsRouter from "./routes/analytics.router";
import * as controller from "./controllers/index.controller";
import { generalErrorHandler, noPathHandler } from "./middleware/error.handler";
import { asyncRoute } from "./middleware/async.handler";

dotenv.config();

export interface RedirectObject {
  _id: ObjectId;
  link: string;
  visits: number;
  last_visit: string;
  last_visit_ms: number;
  output?: string;
};

export interface LinkObject {
  _id: ObjectId;
  target: string;
  shrinks: RedirectObject[];
};

export interface StatsObject {
  [key: string]: string | number | ObjectId
};
declare module "express-serve-static-core" {
  interface Request {
    links: LinkObject[] | undefined;
    no_path_err: string;
    no_match: boolean;
  }
};

const app: Express = express();
export const port: string | undefined = process.env.PORT;
export const host: string | undefined = process.env.HOST;
export const db_uri: string | undefined = process.env.DB_URI;
export const db_name: string | undefined = process.env.DB_NAME;

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use((req: Request, _, next: NextFunction): void =>{
  req.no_path_err = `Path "${req.url}" not found for method "${req.method}"`;
  next();
});

app.use("/api/create", createRouter);
app.use("/api/edit", editRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/:shrinked", asyncRoute(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const target: string | undefined = await controller.useLink(req.params.shrinked);
  target !== undefined ? res.redirect(target): res.status(404).send(req.no_path_err)
}));

app.use("/", express.static("public"));

app.use(generalErrorHandler);

app.use("*", noPathHandler);

(async (): Promise<void> => {
  try{
    await mongoConnect(db_uri, db_name);
    await app.listen( {port, host}, (): void => {
      console.log(`Server is running at http://${host}:${port}`);
    })
  }catch (err){
    console.log(err)
  }
})();
