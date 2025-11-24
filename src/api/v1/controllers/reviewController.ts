import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as reviewService from "../services/reviewService";
import { successResponse } from "../models/responseModel";
import { Review } from "../models/reviewModel";

/**
 * Manages requests and responses to retrieve all Reviews
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const reviews = await reviewService.getAllReviews();
        res.status(HTTP_STATUS.OK).json(
            successResponse(reviews, "Reviews successfully retrieved")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve a Review by ID
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getReviewById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const review: Review = await reviewService.getReviewById(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(review, "Review retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests, responses, and validation to create a Review
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const createReview = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
            const { title, content, rating } = req.body;

            const newReview: Review = await reviewService.createReview({ 
                title,
                content,
                rating,
            });
            res.status(HTTP_STATUS.CREATED).json(
                successResponse(newReview, "Review created successfully")
            );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to update a Review
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const updateReview = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // const id: string = req.params.id;
        const { id } = req.params;

        // Extract update fields
        const { title, content, rating } = req.body;

        // create the update review object with the fields to be updated
        const updatedReview = await reviewService.updateReview(id, {
            title,
            content,
            rating,
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedReview, "Review updated successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to delete a Review
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteReview = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        await reviewService.deleteReview(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse("Review successfully deleted")
        );
    } catch (error: unknown) {
        next(error);
    }
};