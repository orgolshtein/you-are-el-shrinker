import { ObjectId } from "mongodb";

import * as links_model from "../models/links.model.js";
import { LinkObject, RedirectObject, port, host, prod_link } from "../index.js";
import { asyncHandler } from "../middleware/async.handler.js";

const createUniqueHash = asyncHandler(async (): Promise<string | void> => {
  const randomHash: string = (Math.random() + 1).toString(36).substring(5);
  const linkCompare: LinkObject | undefined = await links_model.getLink(randomHash, null);
  if (linkCompare === undefined){
    return randomHash
  } else {
    createUniqueHash();
  }
});

export const createLink = asyncHandler(async (
  target_value: string, 
  param: string
  ): Promise<RedirectObject | undefined> => {
  const randomUniqueHash: string = await createUniqueHash();
  const linkObj: LinkObject | undefined = await links_model.getLink(target_value, "by_target", param);
  const newRedirectObj: RedirectObject = {
    _id: new ObjectId,
    link: randomUniqueHash,
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
    return {...newRedirectObj, output: `${prod_link}/${randomUniqueHash}`}
  } else {
    linkObj.shrinks.push(newRedirectObj);
    await links_model.updateLink(linkObj);
    return {...newRedirectObj, output: `${prod_link}/${randomUniqueHash}`}
  }
});