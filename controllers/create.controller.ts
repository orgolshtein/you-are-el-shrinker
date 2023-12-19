import { ObjectId } from "mongodb";

import * as create_model from "../models/create.model";
import * as link_model from "../models/links.model";
import { LinkObject, RedirectObject, port, host } from "../index";

export const createLink = async (target: string, param: string): Promise<RedirectObject | undefined> => {
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
        return {...newRedirectObj, output: `http://${host}:${port}/${randomHash}`}
      } else {
        linkObj.shrinks.push(newRedirectObj);
        await link_model.updateLink(linkObj);
        return {...newRedirectObj, output: `http://${host}:${port}/${randomHash}`}
        }
      } catch (err) {
        console.log(err)
      }
};