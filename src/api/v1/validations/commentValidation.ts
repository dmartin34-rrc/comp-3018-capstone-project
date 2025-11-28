import Joi from "joi";
import { RequestSchemas } from "../middleware/validate";

/**
 * @openapi
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - authorId
 *         - comment
 *       properties:
 *         authorId:
 *           type: string
 *           description: The unique identifier for a user
 *           example: "1"
 *         comment:
 *           type: string
 *           description: The content of the comment
 *           example: "I hate this movie so much"
 */
export const commentSchemas: Record<string, RequestSchemas> = {
    // POST /api/v1/comments - Create new Comment
    create: {
        body: Joi.object({
            comment: Joi.string().required().messages({
                "any.required": "Content is required",
                "string.empty": "Content cannot be empty",
            }),
        }),
    },

    // PUT /api/v1/comments/:id - Update Comment
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Comment ID is required",
                "string.empty": "Comment ID cannot be empty",
            }),
        }),
        body: Joi.object({
            comment: Joi.string().required().messages({
                "string.empty": "Comment cannot be empty",
            }),
        }),
    },
};
