import * as edit_model from "../models/edit.model";
import * as link_model from "../models/links.model";
import { LinkObject, RedirectObject, host, port } from "../index";
import { ObjectId } from "mongodb";

export const editLink = async (id: string, new_link: string): Promise<RedirectObject | boolean | undefined> => {
  try{
    const matchObj: LinkObject | undefined = await link_model.getLinkbyRedirect(new_link); 
    const linkObj: LinkObject | undefined = await edit_model.getLinkbyId(id);
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
            linkObj.shrinks.forEach((item, i): void => {
                if (item._id.toString() === id){
                    linkObj.shrinks.splice(i, 1 ,{
                        _id: item._id,
                        link: new_link,
                        visits: item.visits,
                        last_visit: item.last_visit,
                        last_visit_ms: item.last_visit_ms,
                        output: `http://${host}:${port}/${new_link}`
                    });
                    redirectObj = linkObj.shrinks[i]
                }
            })
            await link_model.updateLink(linkObj)
            return redirectObj
        }
    }
} catch (err){
    console.log(err);
}
};

export const deleteAllLinks = async (): Promise<any> => {
  return await edit_model.deleteAllLinks();
};