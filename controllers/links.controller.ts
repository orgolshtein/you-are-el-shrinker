import { ObjectId } from "mongodb";

import * as link_model from "../models/links.model";
import { LinkObject } from "../index";

export const getAllLinks = async (links: LinkObject[]): Promise<unknown> => {
    try{
        links = await link_model.getAllLinks();
    } catch (err){
        return err;
    }
};

export const addRequestProps = (
    url: string, 
    method: string
    ): string | unknown => {
    try{
        const msg: string = `Path "${url}" not found for method "${method}"`
        return msg;
    } catch (err){
        return err;
    }
};

export const useLink = async (param: string): Promise<string | unknown> => {
    try{
        const chosenLinkObj: LinkObject = await link_model.getOneLink(param);
        let id: ObjectId = chosenLinkObj._id
        chosenLinkObj.shrinks.forEach((item, i): void => {
            if (item.link === param){
                chosenLinkObj.shrinks.splice(i, 1 ,{
                    _id: item._id,
                    link: param,
                    visits: item.visits + 1,
                    last_visit: new Date(Date.now()).toString(),
                    last_visit_ms: Date.now()
                });
            }
        })
        await link_model.updateOne(chosenLinkObj)
        return chosenLinkObj.target
    } catch (err){
        return err;
     }
};