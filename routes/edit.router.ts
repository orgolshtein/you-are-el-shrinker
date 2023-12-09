import { Router, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import { UrlObject, linksArray, writeToUrlData, host, port } from "../index";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.patch("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      let chosenLinkObj: UrlObject = {id:-1, target:"", shrinked:"", visits: 0, last_visit: "None", last_visit_ms: 0};
      let patchedLinkObj: UrlObject = {id:-1, target:"", shrinked:"", visits: 0, last_visit: "None", last_visit_ms: 0};
      linksArray.forEach((item, i): void => {
        if (item.shrinked === req.body.shrinked){
          let err: Error = new Error("Path already in use");
          next(err)
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
      }
    } catch (err){
      next(err)
    }
  });
  
  router.put("/reset/data/totest", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      let linksResetArray:UrlObject[] = [
        {
          id: 1,
          target: "https://unagibet.onrender.com",
          shrinked: "unagi",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 2,
          target: "https://id-validator-js.netlify.app",
          shrinked: "id-val",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 3,
          target: "https://id-validator-reactjs.onrender.com",
          shrinked: "id-val2",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 4,
          target: "https://orgolshtein.wixsite.com/portfolio",
          shrinked: "orgo",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 5,
          target: "https://www.facebook.com",
          shrinked: "fb",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 6,
          target: "https://www.google.com",
          shrinked: "gl",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 7,
          target: "https://www.youtube.com",
          shrinked: "yt",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 8,
          target: "https://www.linkedin.com",
          shrinked: "lin",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 9,
          target: "https://unagibet.onrender.com",
          shrinked: "unagibet",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 10,
          target: "https://id-validator-reactjs.onrender.com",
          shrinked: "id-reactjs",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 11,
          target: "https://unagibet.onrender.com",
          shrinked: "ubt",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 12,
          target: "https://unagibet.onrender.com",
          shrinked: "unbet",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 13,
          target: "https://unagibet.onrender.com",
          shrinked: "unagb",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 14,
          target: "https://www.facebook.com",
          shrinked: "fbook",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 15,
          target: "https://id-validator-reactjs.onrender.com",
          shrinked: "reactidval",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 16,
          target: "https://unagibet.onrender.com",
          shrinked: "unag",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 17,
          target: "https://unagibet.onrender.com",
          shrinked: "ubet",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 18,
          target: "https://unagibet.onrender.com",
          shrinked: "unabet",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 19,
          target: "https://id-validator-reactjs.onrender.com",
          shrinked: "id-rejs",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        },
        {
          id: 20,
          target: "https://orgolshtein.wixsite.com/portfolio",
          shrinked: "org",
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        }
      ]
      await writeToUrlData(linksResetArray);
      res.status(200).send("Data reset")
    } catch (err){
      next(err);
    }
  });

export default router;