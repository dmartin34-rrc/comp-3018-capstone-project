import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as commentService from "../services/commentService";
import { successResponse } from "../models/responseModel";
import { Comment } from "../models/commentModel";

/**
 * Manages requests and responses to retrieve all Comments
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllComments = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const comments = await commentService.getAllComments();
        res.status(HTTP_STATUS.OK).json(
            successResponse(comments, "Comments successfully retrieved")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve a Comment by ID
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getCommentById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const comment: Comment = await commentService.getCommentById(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse(comment, "Comment retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests, responses, and validation to create a Comment
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { comment, authorId } = req.body;

        const newComment: Comment = await commentService.createComment({
            comment,
            authorId,
        });

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newComment, "Comment created successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to update a Comment
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const updatedComment = await commentService.updateComment(id, { comment });

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedComment, "Comment updated successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to delete a Comment
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        await commentService.deleteComment(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse("Comment successfully deleted")
        );
    } catch (error: unknown) {
        next(error);
    }
};