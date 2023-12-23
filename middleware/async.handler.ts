import { NextFunction, Request, Response } from "express";

export const asyncRoute = (fn: Function) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export const asyncHandler = (fn: Function) => (...args: any[]) => fn(...args).catch((err: Error)=> console.log(err));