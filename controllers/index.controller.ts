import * as links_model from "../models/links.model";
import { LinkObject, RedirectObject } from "../index";
import { asyncHandler } from "../middleware/async.handler";

export const useLink = asyncHandler(async (redirect_link: string): Promise<string | undefined> => {
    const linkObj: LinkObject | undefined = await links_model.getLink(redirect_link, null);
    if (linkObj !== undefined){
        linkObj.shrinks.forEach((item: RedirectObject, i: number): void => {
            if (item.link === redirect_link){
                linkObj.shrinks.splice(i, 1 ,{
                    _id: item._id,
                    link: redirect_link,
                    visits: item.visits + 1,
                    last_visit: new Date(Date.now()).toString(),
                    last_visit_ms: Date.now()
                });
            }
        })
        await links_model.updateLink(linkObj)
        return linkObj.target
    }
});