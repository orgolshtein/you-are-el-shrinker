import * as edit_model from "../models/edit.model";
import * as link_model from "../models/links.model";
import { LinkObject, host, port } from "../index";

export const editLink = async (link: string, new_link: string): Promise<LinkObject | undefined> => {
  try{
    const linkObj: LinkObject | undefined = await link_model.getLinkbyRedirect(link);
    if (linkObj !== undefined){
        linkObj.shrinks.forEach((item, i): void => {
            if (item.link === link){
                linkObj.shrinks.splice(i, 1 ,{
                    _id: item._id,
                    link: new_link,
                    visits: item.visits,
                    last_visit: item.last_visit,
                    last_visit_ms: item.last_visit_ms
                });
            }
        })
        await link_model.updateLink(linkObj)
        return {...linkObj, output: `http://${host}:${port}/${new_link}`};
    }
} catch (err){
    console.log(err);
}
};

export const deleteAllLinks = async (): Promise<any> => {
  return await edit_model.deleteAllLinks();
};