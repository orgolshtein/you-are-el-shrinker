import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser  from "body-parser";
import fs from "fs/promises";

dotenv.config();

interface UrlObject {
  id: number;
  target: string;
  shrinked: string;
  visits: number;
  last_visit: string;
  last_visit_ms: number;
}

let linksArray:UrlObject[]

const app: Express = express();
const port: string | undefined = process.env.PORT;
const host: string | undefined = process.env.HOST;

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const writeToUrlData = async (payload:any): Promise<void> => {
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
    res.status(404).send("Path not found")
  }
});

app.post("/:target", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    let randomHash: string = (Math.random() + 1).toString(36).substring(5);
    let newLinkObj: UrlObject = {
      id: linksArray.length+1, 
      target: `https://${req.params.target}`, 
      shrinked: randomHash,
      visits: 0,
      last_visit: "None",
      last_visit_ms: 0
    }
    linksArray.push(newLinkObj);
    await writeToUrlData(linksArray);
    res.json(newLinkObj)
  } catch (err) {
    next(err)
  }
});

app.post("/:target/:inner", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    let randomHash: string = (Math.random() + 1).toString(36).substring(5);
    let newLinkObj: UrlObject = {
      id: linksArray.length+1, 
      target: `https://${req.params.target}/${req.params.inner}`, 
      shrinked: randomHash,
      visits: 0,
      last_visit: "None",
      last_visit_ms: 0
    }
    linksArray.push(newLinkObj);
    await writeToUrlData(linksArray);
    res.json(newLinkObj)
  } catch (err) {
    next(err)
  }
});

app.post("/:target/:inner1/:inner2", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    let randomHash: string = (Math.random() + 1).toString(36).substring(5);
    let newLinkObj: UrlObject = {
      id: linksArray.length+1, 
      target: `https://${req.params.target}/${req.params.inner1}/${req.params.inner2}`, 
      shrinked: randomHash,
      visits: 0,
      last_visit: "None",
      last_visit_ms: 0
    }
    linksArray.push(newLinkObj);
    await writeToUrlData(linksArray);
    res.json(newLinkObj)
  } catch (err) {
    next(err)
  }
});

app.post("/:target/:inner1/:inner2/:inner3", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    let randomHash: string = (Math.random() + 1).toString(36).substring(5);
    let newLinkObj: UrlObject = {
      id: linksArray.length+1, 
      target: `https://${req.params.target}/${req.params.inner1}/${req.params.inner2}/${req.params.inner3}`, 
      shrinked: randomHash,
      visits: 0,
      last_visit: "None",
      last_visit_ms: 0
    }
    linksArray.push(newLinkObj);
    await writeToUrlData(linksArray);
    res.json(newLinkObj)
  } catch (err) {
    next(err)
  }
});

app.post("/:target/:inner1/:inner2/:inner3/:inner4", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    let randomHash: string = (Math.random() + 1).toString(36).substring(5);
    let newLinkObj: UrlObject = {
      id: linksArray.length+1, 
      target: `https://${req.params.target}/${req.params.inner1}/${req.params.inner2}/${req.params.inner3}/${req.params.inner4}`, 
      shrinked: randomHash,
      visits: 0,
      last_visit: "None",
      last_visit_ms: 0
    }
    linksArray.push(newLinkObj);
    await writeToUrlData(linksArray);
    res.json(newLinkObj)
  } catch (err) {
    next(err)
  }
});

app.post("/:target/:inner1/:inner2/:inner3/:inner4/:inner5", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    let randomHash: string = (Math.random() + 1).toString(36).substring(5);
    let newLinkObj: UrlObject = {
      id: linksArray.length+1, 
      target: `https://${req.params.target}/${req.params.inner1}/${req.params.inner2}/${req.params.inner3}/${req.params.inner4}/${req.params.inner5}`, 
      shrinked: randomHash,
      visits: 0,
      last_visit: "None",
      last_visit_ms: 0
    }
    linksArray.push(newLinkObj);
    await writeToUrlData(linksArray);
    res.json(newLinkObj)
  } catch (err) {
    next(err)
  }
});

app.patch("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    let chosenLinkObj: UrlObject = {id:-1, target:"", shrinked:"", visits: 0, last_visit: "None", last_visit_ms: 0};
    let patchedLinkObj: UrlObject = {id:-1, target:"", shrinked:"", visits: 0, last_visit: "None", last_visit_ms: 0};
    linksArray.forEach((item, i) => {
      if (item.shrinked === req.body.shrinked){
        res.status(404).send("Path already in use");
      } else{
        if (item.id.toString() === req.params.id) {
          chosenLinkObj = item;
          patchedLinkObj = {...chosenLinkObj, shrinked: req.body.shrinked};
          linksArray.splice(i,1,patchedLinkObj);
        }
      }
    })
    if (patchedLinkObj.id !== -1) {
      await writeToUrlData(linksArray)
      res.status(200).json({...patchedLinkObj, updated:`http://${host}:${port}/${req.body.shrinked}`})
    } else{
      res.status(404).send("ID not found");
    }
  } catch (err){
    next(err)
  }
});

app.put("/reset/data/totest", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    linksArray = [
      {
        id: 1,
        target: "https://unagibet.onrender.com/",
        shrinked: "unagi",
        visits: 0,
        last_visit: "None",
        last_visit_ms: 0
      },
      {
        id: 2,
        target: "https://id-validator-js.netlify.app/",
        shrinked: "id-val",
        visits: 0,
        last_visit: "None",
        last_visit_ms: 0
      },
      {
        id: 3,
        target: "https://id-validator-reactjs.onrender.com/",
        shrinked: "id-val2",
        visits: 0,
        last_visit: "None",
        last_visit_ms: 0
      }
    ]
    await writeToUrlData(linksArray);
    res.status(200).send("Data reset")
  } catch (err){
    next(err);
  }
})

app.use((err: Error, req: Request, res: Response, next: NextFunction): void =>{
  res.status(500).json({error: err.message})
})

app.use("*", (req: Request, res: Response): void =>{
  res.status(404).send(`${req.url} not found for method ${req.method}`)
})

app.listen( {port, host}, () : void => {
  console.log(`Server is running at http://${host}:${port}`);
});
