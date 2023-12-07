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

export interface UrlObject {
  id: number;
  target: string;
  shrinked: string;
  visits: number;
  last_visit: string;
  last_visit_ms: number;
}

export let linksArray:UrlObject[]

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

app.use(async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
  try{
    const urlData: string = await fs.readFile("./data/url-data.json", "utf8");
    linksArray = JSON.parse(urlData);
    next();
  } catch (err){
    next(err)
  }
});

app.use("/api/create", createRouter);
app.use("/api/edit", editRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/:shrinked", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let chosenLinkObj: UrlObject[] = linksArray.filter(item => item.shrinked === req.params.shrinked);
  if (chosenLinkObj.length){
    linksArray.forEach((item, i)=> {
      if (item.shrinked === req.params.shrinked){
        item.visits++;
        item.last_visit = new Date(Date.now()).toString();
        item.last_visit_ms = Date.now()
      }
      linksArray.splice(i,1,item);
    })
    await writeToUrlData(linksArray);
    res.redirect(chosenLinkObj[0].target)
  } else {
    let err: Error = new Error("Path not found");
    next(err)
  }
});

app.use("/", express.static("public"));

app.use((err: Error, req: Request, res: Response, next: NextFunction): void =>{
  res.status(500).json(err.message)
});

app.use("*", (req: Request, res: Response): void =>{
  res.status(404).send(`${req.url} not found for method ${req.method}`)
});

app.listen( {port, host}, () : void => {
  console.log(`Server is running at http://${host}:${port}`);
});
