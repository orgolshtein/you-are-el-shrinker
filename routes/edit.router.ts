import { Router, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import { LinkObject, writeToUrlData, host, port } from "../index";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.patch("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      let path_in_use: boolean = false;
      req.nomatch = true;
      let chosenLinkObj: LinkObject = {id:-1, target:"", shrinked:"", visits: 0, last_visit: "None", last_visit_ms: 0};
      let patchedLinkObj: LinkObject = {id:-1, target:"", shrinked:"", visits: 0, last_visit: "None", last_visit_ms: 0};
      req.links.forEach((item, i): void => {
        if (item.shrinked === req.body.shrinked){
          path_in_use = true;
        } else{
          if (item.id?.toString() === req.params.id) {
            req.nomatch = false;
            chosenLinkObj = item;
            patchedLinkObj = {...chosenLinkObj, shrinked: req.body.shrinked};
            req.links.splice(i,1,patchedLinkObj);
          }
        }
      })
      if (path_in_use) {
        let err: Error = new Error("Path already in use");
        next(err);
      } else{
        if (req.nomatch) {
          res.status(404).send(req.nopatherr);
        } else {
          await writeToUrlData(req.links)
          res.status(200).json({...patchedLinkObj, shrinked:`http://${host}:${port}/${req.body.shrinked}`})
        }
      }
    } catch (err){
      next(err)
    }
  });
  
  router.put("/reset/data/totest", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      let linksResetArray:LinkObject[] = [
        {
          id: 1,
          target: "https://unagibet.onrender.com",
          shrinked: "unagi",
          visits: 3,
          last_visit: "Thu Dec 14 2023 11:04:17 GMT+0200 (Israel Standard Time)",
          last_visit_ms: 1702544657778
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
          visits: 2,
          last_visit: "Thu Dec 14 2023 10:53:57 GMT+0200 (Israel Standard Time)",
          last_visit_ms: 1702544037242
        },
        {
          id: 4,
          target: "https://orgolshtein.wixsite.com/portfolio",
          shrinked: "orgo",
          visits: 5,
          last_visit: "Thu Dec 14 2023 11:04:01 GMT+0200 (Israel Standard Time)",
          last_visit_ms: 1702544641663
        },
        {
          id: 5,
          target: "https://www.facebook.com",
          shrinked: "fb",
          visits: 2,
          last_visit: "Thu Dec 14 2023 11:04:50 GMT+0200 (Israel Standard Time)",
          last_visit_ms: 1702544690656
        },
        {
          id: 6,
          target: "https://www.google.com",
          shrinked: "gl",
          visits: 4,
          last_visit: "Thu Dec 14 2023 11:04:47 GMT+0200 (Israel Standard Time)",
          last_visit_ms: 1702544687221
        },
        {
          id: 7,
          target: "https://www.youtube.com",
          shrinked: "yt",
          visits: 3,
          last_visit: "Thu Dec 14 2023 11:04:26 GMT+0200 (Israel Standard Time)",
          last_visit_ms: 1702544666147
        },
        {
          id: 8,
          target: "https://www.linkedin.com",
          shrinked: "lin",
          visits: 1,
          last_visit: "Thu Dec 14 2023 10:54:24 GMT+0200 (Israel Standard Time)",
          last_visit_ms: 1702544064976
        },
        {
          id: 9,
          target: "https://unagibet.onrender.com",
          shrinked: "unagibet",
          visits: 6,
          last_visit: "Thu Dec 14 2023 11:04:08 GMT+0200 (Israel Standard Time)",
          last_visit_ms: 1702544648423
        },
        {
          id: 10,
          target: "https://id-validator-reactjs.onrender.com",
          shrinked: "id-reactjs",
          visits: 2,
          last_visit: "Thu Dec 14 2023 10:56:47 GMT+0200 (Israel Standard Time)",
          last_visit_ms: 1702544207176
        },
        {
          id: 11,
          target: "https://unagibet.onrender.com",
          shrinked: "ubt",
          visits: 2,
          last_visit: "Thu Dec 14 2023 10:55:33 GMT+0200 (Israel Standard Time)",
          last_visit_ms: 1702544133226
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
          visits: 3,
          last_visit: "Thu Dec 14 2023 11:04:30 GMT+0200 (Israel Standard Time)",
          last_visit_ms: 1702544670689
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
          visits: 1,
          last_visit: "Thu Dec 14 2023 10:55:05 GMT+0200 (Israel Standard Time)",
          last_visit_ms: 1702544105148
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
          visits: 2,
          last_visit: "Thu Dec 14 2023 11:04:55 GMT+0200 (Israel Standard Time)",
          last_visit_ms: 1702544695439
        }
      ]
      await writeToUrlData(linksResetArray);
      res.status(200).send("Data reset")
    } catch (err){
      next(err);
    }
  });

export default router;