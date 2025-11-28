import Joi from "joi";
import { RequestSchemas } from "../middleware/validate";

/**
 * @openapi
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - id
 *         - authorId
 *         - title
 *         - content
 *         - rating
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for a review
 *           example: "review_abc123"
 *         authorId:
 *           type: string
 *           description: The unique identifier for a user
 *           example: "1"
 *         title:
 *           type: string
 *           description: The title of the review
 *           example: "The best movie of all time: Test"
 *         content:
 *           type: string
 *           description: The content of the review
 *           example: "I love this movie so much"
 *         rating:
 *           type: number
 *           description: The rating of the movie for the review
 *           example: 10
 */
export const reviewSchemas: Record<string, RequestSchemas> = {
    // POST /api/v1/reviews - Create new Review
    create: {
        body: Joi.object({
            title: Joi.string().required().messages({
                "any.required": "Title is required",
                "string.empty": "Title cannot be empty",
            }),
            content: Joi.string().required().messages({
                "any.required": "Content is required",
                "string.empty": "Content cannot be empty",
            }),
            rating: Joi.number().required().min(0).messages({
                "number.min": "Rating must greater than 0",
            }),
        }),
    },

    // PUT /api/v1/reviews/:id - Update Review
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Review ID is required",
                "string.empty": "Review ID cannot be empty",
            }),
        }),
        body: Joi.object({
            title: Joi.string().required().messages({
                "string.empty": "Title cannot be empty",
            }),
            content: Joi.string().required().messages({
                "string.empty": "Content cannot be empty",
            }),
            rating: Joi.number().required().min(0).messages({
                "number.min": "Rating must greater than 0",
            }),
        }),
    },
};
