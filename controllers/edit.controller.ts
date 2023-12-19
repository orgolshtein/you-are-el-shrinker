import * as edit_model from "../models/edit.model";
import * as link_model from "../models/links.model";
import { LinkObject, host, port } from "../index";

export const editLink = async (id: string, new_link: string): Promise<LinkObject | boolean | undefined> => {
  try{
    const matchObj: LinkObject | undefined = await link_model.getLinkbyRedirect(new_link); 
    const linkObj: LinkObject | undefined = await edit_model.getLinkbyId(id);
    if (matchObj !== undefined ){
        return false;
    } else {
        if (linkObj !== undefined){
            linkObj.shrinks.forEach((item, i): void => {
                if (item._id.toString() === id){
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
    }
} catch (err){
    console.log(err);
}
};

export const deleteAllLinks = async (): Promise<any> => {
  return await edit_model.deleteAllLinks();
};