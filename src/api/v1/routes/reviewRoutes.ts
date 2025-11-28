import express, { Router } from "express";
// import { validateRequest } from "../middleware/validate";
// import { reviewSchemas } from "../validations/reviewValidation";
import * as reviewController from "../controllers/reviewController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { AuthorizationOptions } from "../models/authorizationOptions";
import profanityFilter from "../middleware/profanityFilter";

const router: Router = express.Router();

/**
 * @openapi
 * /reviews:
 *   get:
 *     summary: Retrieve a list of reviews with optional filtering
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of reviews to return
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get(
    "/",
    authenticate,
    isAuthorized({
        hasRole: ["user", "admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    // validateRequest(reviewSchemas.getAllReviews),
    reviewController.getAllReviews
);

router.get(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["user", "admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    // validateRequest(reviewSchemas.getReviewById),
    reviewController.getReviewById
);

/**
 * @openapi
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - rating
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "Test Movie"
 *               content:
 *                 type: string
 *                 example: "I love this movie so much"
 *               rating:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input data
 */
router.post(
    "/",
    authenticate,
    isAuthorized({
        hasRole: ["user", "admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    profanityFilter(["title", "content"]),
    // validateRequest(reviewSchemas.createReview),
    reviewController.createReview
);

router.put(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    profanityFilter(["title", "content"]),
    // validateRequest(reviewSchemas.updateReview),
    reviewController.updateReview
);

router.delete(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    // validateRequest(reviewSchemas.deleteReview),
    reviewController.deleteReview
);

export default router;