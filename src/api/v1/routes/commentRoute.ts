import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { commentSchemas } from "../validations/commentValidation";
import * as commentController from "../controllers/commentController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { AuthorizationOptions } from "../models/authorizationOptions";
import profanityFilter from "../middleware/profanityFilter";

const router: Router = express.Router();

/**
 * @openapi
 * /comments:
 *   get:
 *     summary: Retrieve a list of comments with optional filtering
 *     tags: [Comments]
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
 *         description: Maximum number of comments to return
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get(
    "/",
    authenticate,
    isAuthorized({
        hasRole: ["user", "admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    commentController.getAllComments
);

/**
 * @openapi
 * /comments/id:
 *   get:
 *     summary: Retrieve a comment by specified id
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the comment
 *     responses:
 *       200:
 *         description: A comment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["user", "admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    commentController.getCommentById
);

/**
 * @openapi
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "I hate this movie so much"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
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
    profanityFilter(["comment"]),
    validateRequest(commentSchemas.createComment),
    commentController.createComment
);

/**
 * @openapi
 * /comments/id:
 *   put:
 *     summary: Update a specific comment's information
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "This movie is great!"
 *     responses:
 *       '200':
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '404':
 *         description: Comment not found
 *       '403':
 *         description: Not authorized to update this comment
 */
router.put(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    profanityFilter(["comment"]),
    validateRequest(commentSchemas.updateComment),
    commentController.updateComment
);

/**
 * @openapi
 * /comments/id:
 *   get:
 *     summary: Delete a comment by specified id
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the comment
 *     responses:
 *       200:
 *         description: Comment deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
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
