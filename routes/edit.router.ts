import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

import * as edit_controller from "../controllers/edit.controller.js";
import { RedirectObject } from "../index.js";
import { asyncRoute } from "../middleware/async.handler.js";
import { noPathHandler } from "../middleware/error.handler.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.patch("/:id", asyncRoute(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const redirectObj: RedirectObject | boolean | undefined = await edit_controller.editLink(
        req.params.id, 
        req.body.new_link
        );
    if (redirectObj === false){
        req.no_path_err = "Path is already in use";
        noPathHandler(req, res);
    } else {
        redirectObj !== undefined && typeof redirectObj !== "boolean" ? 
        res.status(200).json({_id: redirectObj._id, output: redirectObj.output}): 
        noPathHandler(req, res);
    }
}));

export default router;