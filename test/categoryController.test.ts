import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as categoryController from "../src/api/v1/controllers/categoryController";
import * as categoryService from "../src/api/v1/services/categoryService";
import { Category } from "../src/api/v1/models/categoryModel";

jest.mock('../config/firebaseConfig', () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));
jest.mock("../src/api/v1/services/categoryService");

describe("Category Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    // reusable mocks for any controller tests
    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    describe("getAllCategories", () => {
        it("should handle successful operation", async () => {
            const mockCategories: Category[] = [
                {
                    id: "1",
                    name: "Test",
                },
            ];
            (categoryService.getAllCategories as jest.Mock).mockReturnValue(mockCategories);

            await categoryController.getAllCategories(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Categories successfully retrieved",
                status: "success",
                data: mockCategories,
            });
        });
    });

    describe("getCategoryById", () => {
        it("should handle successful operation", async () => {
            // Arrange
            const mockCategory: Category[] = [
                { id: "1", name: "Test"},
            ];

            mockReq.params = { id: "1" };

            (categoryService.getCategoryById as jest.Mock).mockReturnValue(mockCategory);

            // Act
            await categoryController.getCategoryById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Category retrieved successfully",
                data: mockCategory,
                status: "success",
            });
        });
    });
    
        it("should return an error", async () => {
            // Arrange
            const mockError = new Error('Test error');
            (categoryService.getCategoryById as jest.Mock).mockRejectedValue(mockError);

            // Act
            await categoryController.getCategoryById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });

    describe("createCategory", () => {
        it("should handle successful creation", async () => {
            const mockBody = {
                name: "Test"
            };

            const mockCategory: Category = {
                id: "test_id",
                ...mockBody,
            };

            mockReq.body = mockBody;
            (categoryService.createCategory as jest.Mock).mockReturnValue(mockCategory);

            await categoryController.createCategory(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Category created successfully",
                data: mockCategory,
                status: "success",
            });
        });

        it("should return an error", async () => {
            // Arrange
            const mockError = new Error('Test error');
            (categoryService.createCategory as jest.Mock).mockRejectedValue(mockError)

            // Act
            await categoryController.createCategory(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
            });
        });

    describe("updateCategory", () => {
        it("should handle successful operation", async () => {
            // Arrange
            const mockCategory: Category[] = [
                { id: "1", name: "Test"},
            ];

            mockReq.params = { id: "1" };
            mockReq.body = {
                name: "Updated",
            };

            (categoryService.updateCategory as jest.Mock).mockReturnValue(mockCategory);

            // Act
            await categoryController.updateCategory(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Category updated successfully",
                data: mockCategory,
                status: "success",
            });
        });
    
    describe("deleteCategory", () => {
        it("should handle successful operation", async () => {
            // Arrange
            const mockCategory: Category[] = [
                { id: "1", name: "Test"},
            ];

            mockReq.params = { id: "1" };
            mockReq.body = {
                name: "Updated",
            };

            (categoryService.deleteCategory as jest.Mock).mockReturnValue(mockCategory);

            // Act
            await categoryController.deleteCategory(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: "Category successfully deleted",
                message: undefined,
                status: "success",
            });
        });
    });
    });
});
