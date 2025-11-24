import express, { Router } from "express";
import * as commentController from "../controllers/commentController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { AuthorizationOptions } from "../models/authorizationOptions";

const router: Router = express.Router();

router.get(
    "/",
    authenticate,
    isAuthorized({
        hasRole: ["user", "admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    commentController.getAllComments
);

router.get(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["user", "admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    commentController.getCommentById
);

router.post(
    "/",
    authenticate,
    isAuthorized({
        hasRole: ["user", "admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    commentController.createComment
);

router.put(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    commentController.updateComment
);

router.delete(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    commentController.deleteComment
);

export default router;
