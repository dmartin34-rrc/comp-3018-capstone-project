import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as reviewController from "../src/api/v1/controllers/reviewController";
import * as reviewService from "../src/api/v1/services/reviewService";
import { Review } from "../src/api/v1/models/reviewModel";
import { title } from "process";

jest.mock('../config/firebaseConfig', () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));
jest.mock("../src/api/v1/services/reviewService");

describe("Review Controller", () => {
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

    describe("getAllReviews", () => {
        it("should handle successful operation", async () => {
            const mockReviews: Review[] = [
                {
                    id: "1",
                    authorId: "1",
                    title: "Test title",
                    content: "Test content",
                    rating: 10,
                },
            ];
            (reviewService.getAllReviews as jest.Mock).mockReturnValue(mockReviews);

            await reviewController.getAllReviews(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Reviews successfully retrieved",
                status: "success",
                data: mockReviews,
            });
        });
    });

    describe("getReviewById", () => {
        it("should handle successful operation", async () => {
            // Arrange
            const mockReview: Review[] = [
                { id: "1", authorId: "123", title: "Test title", content: "test", rating: 10},
            ];

            mockReq.params = { id: "1" };

            (reviewService.getReviewById as jest.Mock).mockReturnValue(mockReview);

            // Act
            await reviewController.getReviewById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Review retrieved successfully",
                data: mockReview,
                status: "success",
            });
        });

        it("should return an error", async () => {
            // Arrange
            const mockError = new Error('Test error');
            (reviewService.getReviewById as jest.Mock).mockRejectedValue(mockError);

            // Act
            await reviewController.getReviewById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });

    describe("createReview", () => {
        it("should handle successful creation", async () => {
            const mockBody = {
                title: "Test Title",
                content: "Test content",
                rating: 10,
            };

            const mockReview: Review = {
                id: "test_id",
                authorId: "1",
                ...mockBody,
            };

            mockReq.body = mockBody;
            (reviewService.createReview as jest.Mock).mockReturnValue(mockReview);

            await reviewController.createReview(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Review created successfully",
                data: mockReview,
                status: "success",
            });
        });

        it("should return an error", async () => {
            // Arrange
            const mockError = new Error('Test error');
            (reviewService.createReview as jest.Mock).mockRejectedValue(mockError)

            // Act
            await reviewController.createReview(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
            });
        });
    
    describe("updateReview", () => {
        it("should handle successful operation", async () => {
            // Arrange
            const mockReview: Review[] = [
                { id: "1", authorId: "123", title: "Test title", content: "test content", rating: 10},
            ];

            mockReq.params = { id: "1" };
            mockReq.body = {
                authorId: "123",
                title: "Updated title",
                content: "Updated content",
                rating: 9,
            };

            (reviewService.updateReview as jest.Mock).mockReturnValue(mockReview);

            // Act
            await reviewController.updateReview(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Review updated successfully",
                data: mockReview,
                status: "success",
            });
        });

    describe("deleteReview", () => {
        it("should handle successful operation", async () => {
            // Arrange
            const mockReview: Review[] = [
                { id: "1", authorId: "123", title: "Test title", content: "test content", rating: 10},
            ];

            mockReq.params = { id: "1" };
            mockReq.body = {
                authorId: "123",
                title: "Updated title",
                content: "Updated content",
                rating: 9,
            };

            (reviewService.deleteReview as jest.Mock).mockReturnValue(mockReview);

            // Act
            await reviewController.deleteReview(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: "Review successfully deleted",
                message: undefined,
                status: "success",
            });
        });
    });
    });
});
});
