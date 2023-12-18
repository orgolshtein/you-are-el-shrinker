import { ObjectId } from "mongodb";

import * as edit_model from "../models/edit.model";
import * as link_model from "../models/links.model";
import { LinkObject, RedirectObject } from "../index";

export const editShrinkedLink = async (): Promise<any> => {
  try{
    
  } catch (err){
    
  }
};

export const deleteAllLinks = async (): Promise<any> => {
  return await edit_model.deleteAllLinks();
};