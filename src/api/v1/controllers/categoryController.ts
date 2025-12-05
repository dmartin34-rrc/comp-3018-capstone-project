import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as categoryService from "../services/categoryService";
import { successResponse } from "../models/responseModel";
import { Category } from "../models/categoryModel";

/**
 * Manages requests and responses to retrieve all Categories
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(HTTP_STATUS.OK).json(
            successResponse(categories, "Categories successfully retrieved")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve a Category by ID
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const category: Category = await categoryService.getCategoryById(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse(category, "Category retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests, responses, and validation to create a Category
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, description } = req.body;

        const newCategory: Category = await categoryService.createCategory({name});

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newCategory, "Category created successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to update a Category
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updatedCategory = await categoryService.updateCategory(id, {name});

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedCategory, "Category updated successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to delete a Category
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        await categoryService.deleteCategory(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse("Category successfully deleted")
        );
    } catch (error: unknown) {
        next(error);
    }
};