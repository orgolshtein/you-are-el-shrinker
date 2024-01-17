import * as links_model from "../models/links.model.js";
import { LinkObject, RedirectObject } from "../index.js";
import { asyncHandler } from "../middleware/async.handler.js";

export const useLink = asyncHandler(async (redirect_link: string): Promise<string | undefined> => {
    const linkObj: LinkObject | undefined = await links_model.getLink(redirect_link.replace(/[^a-zA-Z0-9 ]/g, "_"), null);
    if (linkObj !== undefined){
        linkObj.shrinks.forEach((item: RedirectObject, i: number): void => {
            if (item.link === redirect_link.replace(/[^a-zA-Z0-9 ]/g, "_")){
                linkObj.shrinks[i].visits++;
                linkObj.shrinks[i].last_visit = new Date(Date.now()).toString();
                linkObj.shrinks[i].last_visit_ms = Date.now();
            }
        })
        await links_model.updateLink(linkObj)
        return linkObj.target
    }
});