import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser  from "body-parser";
import fs from "fs/promises";

dotenv.config();

interface UrlObject {
  [key: string]: string;
}

let links:UrlObject[]

const app: Express = express();
const port: string | undefined = process.env.PORT;
const host: string | undefined = process.env.HOST;

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const writeToUrlData = async (payload:any) =>{
  await fs.writeFile("./data/url-data.json", JSON.stringify(payload))
};

app.use(async (req: Request, res: Response, next: NextFunction)=>{
  const urlData: string = await fs.readFile("./data/url-data.json", "utf8");
  links = JSON.parse(urlData);
  next();
});

app.get("/:shrinked", (req: Request, res: Response, next: NextFunction) => {
  const chosen: UrlObject[] = links.filter(item => item.shrinked === req.params.shrinked)
  chosen.length ?
  res.redirect(chosen[0].target) :
  res.status(404).send("Not Found")
});

app.post("/:target", async (req: Request, res: Response) => {
  let hash = (Math.random() + 1).toString(36).substring(7);
  links.push({
    target: `https://${req.params.target}`,
    shrinked: hash
  })
  await writeToUrlData(links);
  res.status(200).send(`http://${host}:${port}/${hash}`)
})

app.listen( {port, host}, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
