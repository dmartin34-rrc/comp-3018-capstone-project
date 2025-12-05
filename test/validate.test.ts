import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
import { reviewSchemas } from "../src/api/v1/validations/reviewValidation";
import { commentSchemas } from "../src/api/v1/validations/commentValidation";
import { categorySchemas } from "../src/api/v1/validations/categoryValidation";
import { MiddlewareFunction } from "../src/api/v1/types/express";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("Validation Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it("should pass validation for valid review data", () => {
        // Arrange
        mockReq.body = {
            authorId: "1",
            title: "Valid Title",
            content: "Valid Content",
            rating: 10
        };
        const middleware: MiddlewareFunction = validateRequest(
            reviewSchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail validation when title is empty string", () => {
        // Arrange
        mockReq.body = {
            authorId: "1",
            title: "",
            content: "Valid content",
            rating: 10
        };
        const middleware: MiddlewareFunction = validateRequest(
            reviewSchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Validation error: Body: Title cannot be empty",
        });
    });

    it("should pass validation for valid comment data", () => {
        // Arrange
        mockReq.body = {
            comment: "This movie sucks"
        };
        const middleware: MiddlewareFunction = validateRequest(
            commentSchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail validation when comment is empty string", () => {
        // Arrange
        mockReq.body = {
            comment: ""
        };
        const middleware: MiddlewareFunction = validateRequest(
            commentSchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Validation error: Body: Comment cannot be empty",
        });
    });

    it("should pass validation for valid category data", () => {
        // Arrange
        mockReq.body = {
            name: "Body-Horror"
        };
        const middleware: MiddlewareFunction = validateRequest(
            categorySchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail validation when name is empty string", () => {
        // Arrange
        mockReq.body = {
            name: ""
        };
        const middleware: MiddlewareFunction = validateRequest(
            categorySchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Validation error: Body: Category cannot be empty",
        });
    });
});
