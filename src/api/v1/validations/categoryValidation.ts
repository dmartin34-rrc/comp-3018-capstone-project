import Joi from "joi";
import { RequestSchemas } from "../middleware/validate";

/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for a category
 *           example: "1"
 *         name:
 *           type: string
 *           description: The name of the category
 *           example: "Supernatural"
 */
export const categorySchemas: Record<string, RequestSchemas> = {
    // POST /api/v1/categories - Create new Category
    create: {
        body: Joi.object({
            name: Joi.string().required().messages({
                "any.required": "Name is required",
                "string.empty": "Category cannot be empty",
            }),
        }),
    },

    // PUT /api/v1/categories/:id - Update Category
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Category ID is required",
                "string.empty": "Category ID cannot be empty",
            }),
        }),
        body: Joi.object({
            name: Joi.string().required().messages({
                "string.empty": "Category cannot be empty",
            }),
        }),
    },
};
