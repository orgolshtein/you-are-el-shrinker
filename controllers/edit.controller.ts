import { ObjectId } from "mongodb";

import * as links_model from "../models/links.model.js";
import { LinkObject, RedirectObject, prod_link } from "../index.js";
import { asyncHandler } from "../middleware/async.handler.js";

export const editLink = asyncHandler(async (
    redirect_id: string, 
    new_redirect: string
    )
    : Promise<RedirectObject | boolean | undefined> => {
    const matchObj: LinkObject | undefined = await links_model.getLink(new_redirect.replace(/[^a-zA-Z0-9 ]/g, "_"), null); 
    const linkObj: LinkObject | undefined = await links_model.getLink(redirect_id, "by_id");
    let redirectObj: RedirectObject = {
        _id: new ObjectId,
        link: "",
        visits: 0,
        last_visit: "",
        last_visit_ms: 0,
        output: ""
    };
    if (matchObj !== undefined ){
        return false;
    } else {
        if (linkObj !== undefined){
            linkObj.shrinks.forEach((item: RedirectObject, i: number): void => {
                if (item._id.toString() === redirect_id){
                    linkObj.shrinks[i].link = new_redirect.replace(/[^a-zA-Z0-9 ]/g, "_");
                    redirectObj = linkObj.shrinks[i]
                }
            })
            await links_model.updateLink(linkObj)
            return {...redirectObj, output: `${prod_link}/${redirectObj.link}`}
        }
    }
});