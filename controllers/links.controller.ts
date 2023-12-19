import * as link_model from "../models/links.model";
import { LinkObject } from "../index";

export const getAllLinks = async (): Promise<LinkObject[] | undefined> => {
    try{
        return await link_model.getAllLinks();
    } catch (err){
        console.log(err);
    }
};

export const useLink = async (param: string): Promise<string | undefined> => {
    try{
        const linkObj: LinkObject | undefined = await link_model.getLinkbyRedirect(param);
        if (linkObj !== undefined){
            linkObj.shrinks.forEach((item, i): void => {
                if (item.link === param){
                    linkObj.shrinks.splice(i, 1 ,{
                        _id: item._id,
                        link: param,
                        visits: item.visits + 1,
                        last_visit: new Date(Date.now()).toString(),
                        last_visit_ms: Date.now()
                    });
                }
            })
            await link_model.updateLink(linkObj)
            return linkObj.target
        }
    } catch (err){
        console.log(err);
    }
};