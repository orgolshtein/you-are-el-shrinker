import { ObjectId } from "mongodb";

import * as create_model from "../models/create.model";
import * as link_model from "../models/links.model";
import { LinkObject, RedirectObject } from "../index";

export const createShrinked = async (target: string, param: string): Promise<any> => {
    try{
      let randomHash: string = (Math.random() + 1).toString(36).substring(5);
      let chosenLinkObj: LinkObject | undefined = await create_model.getOneLink(target, param);
      if (chosenLinkObj === undefined){
        let newLinkObj: LinkObject = {
          _id: new ObjectId,
          target: param ? `https://${target}/${param}` : `https://${target}`, 
          shrinks: [{
            _id: new ObjectId,
            link: randomHash,
            visits: 0,
            last_visit: "None",
            last_visit_ms: 0
          }]
        }
        await create_model.createShrinked(newLinkObj);
        return {...newLinkObj}
      } else {
        let newShrinkedObj: RedirectObject = {
          _id: new ObjectId,
          link: randomHash,
          visits: 0,
          last_visit: "None",
          last_visit_ms: 0
        };
        chosenLinkObj.shrinks.push(newShrinkedObj);
        await link_model.updateOne(chosenLinkObj);
        return {...chosenLinkObj}
        }
      } catch (err) {
        return err
      }
};