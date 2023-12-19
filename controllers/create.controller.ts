import { ObjectId } from "mongodb";

import * as create_model from "../models/create.model";
import * as link_model from "../models/links.model";
import { LinkObject, RedirectObject } from "../index";

export const createLink = async (target: string, param: string): Promise<LinkObject | undefined> => {
    try{
      const randomHash: string = (Math.random() + 1).toString(36).substring(5);
      const linkObj: LinkObject | undefined = await create_model.getLinkByTarget(target, param);
      const newRedirectObj: RedirectObject = {
        _id: new ObjectId,
        link: randomHash,
        visits: 0,
        last_visit: "None",
        last_visit_ms: 0
      };
      if (linkObj === undefined){
        let newLinkObj: LinkObject = {
          _id: new ObjectId,
          target: param ? `https://${target}/${param}` : `https://${target}`, 
          shrinks: [{...newRedirectObj}]
        }
        await create_model.createLink(newLinkObj);
        return {...newLinkObj}
      } else {
        linkObj.shrinks.push(newRedirectObj);
        await link_model.updateOne(linkObj);
        return {...linkObj}
        }
      } catch (err) {
        console.log(err)
      }
};