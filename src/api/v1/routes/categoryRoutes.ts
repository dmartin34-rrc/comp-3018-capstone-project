import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { categorySchemas } from "../validations/categoryValidation";
import * as categoryController from "../controllers/categoryController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { AuthorizationOptions } from "../models/authorizationOptions";
import profanityFilter from "../middleware/profanityFilter";

const router: Router = express.Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories with optional filtering
 *     tags: [Categories]
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
 *         description: Maximum number of categories to return
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get(
    "/",
    authenticate,
    isAuthorized({
        hasRole: ["user", "admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    categoryController.getAllCategories
);

/**
 * @openapi
 * /categories/id:
 *   get:
 *     summary: Retrieve a category by specified id
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the category
 *     responses:
 *       200:
 *         description: A category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["user", "admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    categoryController.getCategoryById
);

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Supernatural"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input data
 */
router.post(
    "/",
    authenticate,
    isAuthorized({
        hasRole: ["admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    profanityFilter(["name"]),
    validateRequest(categorySchemas.createCategory),
    categoryController.createCategory
);

/**
 * @openapi
 * /categories/id:
 *   put:
 *     summary: Update a specific category's information
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Supernatural"
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '404':
 *         description: Category not found
 *       '403':
 *         description: Not authorized to update this category
 */
router.put(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    profanityFilter(["name"]),
    validateRequest(categorySchemas.updateCategory),
    categoryController.updateCategory
);

/**
 * @openapi
 * /categories/id:
 *   get:
 *     summary: Delete a category by specified id
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the category
 *     responses:
 *       200:
 *         description: Category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.delete(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["admin"],
        allowSameUser: true,
    } as AuthorizationOptions),
    categoryController.deleteCategory
);

export default router;
