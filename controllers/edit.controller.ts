import { ObjectId } from "mongodb";

import * as links_model from "../models/links.model";
import { LinkObject, RedirectObject, host, port } from "../index";
import { asyncHandler } from "../middleware/async.handler";

export const editLink = asyncHandler(async (redirect_id: string, new_redirect: string): Promise<RedirectObject | boolean | undefined> => {
    const matchObj: LinkObject | undefined = await links_model.getLink(new_redirect, null); 
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
                    linkObj.shrinks.splice(i, 1 ,{
                        _id: item._id,
                        link: new_redirect,
                        visits: item.visits,
                        last_visit: item.last_visit,
                        last_visit_ms: item.last_visit_ms,
                        output: `http://${host}:${port}/${new_redirect}`
                    });
                    redirectObj = linkObj.shrinks[i]
                }
            })
            await links_model.updateLink(linkObj)
            return redirectObj
        }}
});

export const deleteAllLinks = asyncHandler(async (): Promise<any> => {
    return await links_model.deleteAllLinks();
});