import * as links_model from "../models/links.model.js";
import { LinkObject, RedirectObject } from "../index.js";
import { asyncHandler } from "../middleware/async.handler.js";

export const useLink = asyncHandler(async (redirect_link: string, param: string): Promise<string | undefined> => {
    const linkObj: LinkObject | undefined = await links_model.getLink(redirect_link, null, param);
    if (linkObj !== undefined){
        linkObj.shrinks.forEach((item: RedirectObject, i: number): void => {
            if ((item.link === redirect_link) || (item.link === `${redirect_link}/${param}`)){
                linkObj.shrinks[i].visits++;
                linkObj.shrinks[i].last_visit = new Date(Date.now()).toString();
                linkObj.shrinks[i].last_visit_ms = Date.now();
            }
        })
        await links_model.updateLink(linkObj)
        return linkObj.target
    }
});