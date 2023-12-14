import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser  from "body-parser";
import fs from "fs/promises";

import createRouter from "./routes/create.router";
import editRouter from "./routes/edit.router";
import analyticsRouter from "./routes/analytics.router";

dotenv.config();

export interface LinkObject {
  id: number;
  target: string;
  shrinked: string;
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
    links: LinkObject[];
    stats: StatsObject[];
    nopatherr: string;
    nomatch: boolean;
  }
};

const app: Express = express();
export const port: string | undefined = process.env.PORT;
export const host: string | undefined = process.env.HOST;

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

export const writeToUrlData = async (payload:any): Promise<void> => {
  await fs.writeFile("./data/url-data.json", JSON.stringify(payload))
};

app.use(async (req: Request, _, next: NextFunction): Promise<void> =>{
  try{
    req.nomatch = true;
    req.nopatherr = `Path "${req.url}" not found for method "${req.method}"`
    req.stats = [];
    const urlData: string = await fs.readFile("./data/url-data.json", "utf8");
    req.links = JSON.parse(urlData);
    req.links.forEach((item): void => {
      for (let obj of req.stats){
          if (obj.site === item.target){
              req.nomatch = false;
              obj.clicks += item.visits;
              typeof obj.redirects !== "undefined" ? obj.redirects++ : obj.redirects = 1;
              if (obj.last_visit_ms < item.last_visit_ms){
                  obj.last_visit = item.last_visit;
                  obj.last_visit_ms = item.last_visit_ms;    
              }
          }
      }
      req.nomatch ? req.stats.push({
          site: item.target,
          clicks: item.visits,
          redirects: 1,
          last_visit: item.last_visit,
          last_visit_ms: item.last_visit_ms
      }) : null
  });
    next();
  } catch (err){
    next(err)
  }
});

app.use("/api/create", createRouter);
app.use("/api/edit", editRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/:shrinked", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    let chosenLinkObj: LinkObject[] = req.links.filter((item): boolean => item.shrinked === req.params.shrinked);
    if (chosenLinkObj.length){
      req.links.forEach((item, i): void => {
        if (item.shrinked === req.params.shrinked){
          item.visits++;
          item.last_visit = new Date(Date.now()).toString();
          item.last_visit_ms = Date.now()
        }
        req.links.splice(i,1,item);
      })
      await writeToUrlData(req.links);
      res.redirect(chosenLinkObj[0].target)
    } else {
      res.status(404).send(req.nopatherr)
    }
  }catch (err){
    next(err)
  }
});

app.use("/", express.static("public"));

app.use((err: Error, req: Request, res: Response, next: NextFunction): void =>{
  res.status(500).json(err.message)
});

app.use("*", (req: Request, res: Response): void =>{
  res.status(404).send(req.nopatherr)
});

app.listen( {port, host}, (): void => {
  console.log(`Server is running at http://${host}:${port}`);
});
