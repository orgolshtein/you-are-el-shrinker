import * as link_model from "../models/links.model";
import { LinkObject } from "../index";

export const addRequestProps = async (
    links: LinkObject[] | undefined,
    no_path_err: string,
    url: string, 
    method: string,
    no_match: boolean,
    path_in_use: boolean
    ): Promise<void> => {
        try{
            links = await link_model.getAllLinks();
            no_path_err = `Path "${url}" not found for method "${method}"`;
            no_match = true,
            path_in_use = false
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
            await link_model.updateOne(linkObj)
            return linkObj.target
        }
    } catch (err){
        console.log(err);
    }
};