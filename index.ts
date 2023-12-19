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
import * as links_controller from "./controllers/links.controller";

dotenv.config();

export interface LinkObject {
  _id: ObjectId;
  target: string;
  shrinks: RedirectObject[];
  output?: string
}

export interface RedirectObject {
  _id: ObjectId;
  link: string;
  visits: number;
  last_visit: string;
  last_visit_ms: number;
}

export interface StatsObject {
  site: string;
  clicks: number;
  redirects: number;
  last_visit: string;
  last_visit_ms: number;
}
declare module "express-serve-static-core" {
  interface Request {
    links: LinkObject[] | undefined;
    stats: StatsObject[];
    no_path_err: string;
    no_match: boolean;
    path_in_use: boolean;
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

app.use(async (req: Request, _, next: NextFunction): Promise<void> =>{
  try{
    req.links = await links_controller.getAllLinks();
    req.no_path_err = `Path "${req.url}" not found for method "${req.method}"`;
    req.no_match = true;
    req.path_in_use = false;
    next();
  }catch (err) {
    next(err)
  }
});

app.use("/api/create", createRouter);
app.use("/api/edit", editRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/:shrinked", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const target: string | undefined = await links_controller.useLink(req.params.shrinked);
    target !== undefined ? res.redirect(target): res.status(404).send(req.no_path_err)
  }catch (err){
    next(err)
  }
});

app.use("/", express.static("public"));

app.use((err: Error, req: Request, res: Response, next: NextFunction): void =>{
  res.status(500).json(err.message)
});

app.use("*", (req: Request, res: Response): void =>{
  res.status(404).send(req.no_path_err)
});

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
