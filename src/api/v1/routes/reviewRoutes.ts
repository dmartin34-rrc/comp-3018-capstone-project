import express, { Router } from "express";
import * as reviewController from "../controllers/reviewController";
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
    reviewController.getAllReviews
);

router.get(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["user", "admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    reviewController.getReviewById
);

router.post(
    "/",
    authenticate,
    isAuthorized({
        hasRole: ["user", "admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    reviewController.createReview
);

router.put(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    reviewController.updateReview
);

router.delete(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    reviewController.deleteReview
);

export default router;