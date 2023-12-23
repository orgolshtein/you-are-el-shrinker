import { NextFunction, Request, Response } from "express";

export const generalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void =>{
    res.status(500).json(err.message);
};
  
export const noPathHandler =  (req: Request, res: Response): void =>{
    res.status(404).send(req.no_path_err);
  };