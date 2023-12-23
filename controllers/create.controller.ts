import { ObjectId } from "mongodb";

import * as links_model from "../models/links.model";
import { LinkObject, RedirectObject, port, host } from "../index";
import { asyncHandler } from "../middleware/async.handler";

export const createLink = asyncHandler(async (target_value: string, param: string): Promise<RedirectObject | undefined> => {
  const randomHash: string = (Math.random() + 1).toString(36).substring(5);
  const linkObj: LinkObject | undefined = await links_model.getLink(target_value, "by_target", param);
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
      target: param ? `https://${target_value}/${param}` : `https://${target_value}`, 
      shrinks: [{...newRedirectObj}]
    }
    await links_model.createLink(newLinkObj);
    return {...newRedirectObj, output: `http://${host}:${port}/${randomHash}`}
  } else {
    linkObj.shrinks.push(newRedirectObj);
    await links_model.updateLink(linkObj);
    return {...newRedirectObj, output: `http://${host}:${port}/${randomHash}`}
  }
});