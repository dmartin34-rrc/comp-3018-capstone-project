import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as commentController from "../src/api/v1/controllers/commentController";
import * as commentService from "../src/api/v1/services/commentService";
import { Comment } from "../src/api/v1/models/commentModel";

jest.mock('../config/firebaseConfig', () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));
jest.mock("../src/api/v1/services/commentService");

describe("Comment Controller", () => {
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

    describe("getAllComments", () => {
        it("should handle successful operation", async () => {
            const mockComments: Comment[] = [
                {
                    id: "12",
                    authorId: "1",
                    comment: "Test",
                },
            ];
            (commentService.getAllComments as jest.Mock).mockReturnValue(mockComments);

            await commentController.getAllComments(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Comments successfully retrieved",
                status: "success",
                data: mockComments,
            });
        });
    });

    describe("getCommentById", () => {
        it("should handle successful operation", async () => {
            // Arrange
            const mockComment: Comment[] = [
                { id: "1", authorId: "123", comment: "Test comment"},
            ];

            mockReq.params = { id: "1" };

            (commentService.getCommentById as jest.Mock).mockReturnValue(mockComment);

            // Act
            await commentController.getCommentById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Comment retrieved successfully",
                data: mockComment,
                status: "success",
            });
        });
    });
    
        it("should return an error", async () => {
            // Arrange
            const mockError = new Error('Test error');
            (commentService.getCommentById as jest.Mock).mockRejectedValue(mockError);

            // Act
            await commentController.getCommentById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });

    describe("createComment", () => {
        it("should handle successful creation", async () => {
            const mockBody = {
                authorId: "123",
                comment: "Test"
            };

            const mockComment: Comment = {
                id: "test_id",
                ...mockBody,
            };

            mockReq.body = mockBody;
            (commentService.createComment as jest.Mock).mockReturnValue(mockComment);

            await commentController.createComment(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Comment created successfully",
                data: mockComment,
                status: "success",
            });
        });

        it("should return an error", async () => {
            // Arrange
            const mockError = new Error('Test error');
            (commentService.createComment as jest.Mock).mockRejectedValue(mockError)

            // Act
            await commentController.createComment(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
            });
        });

    describe("updateComment", () => {
            it("should handle successful operation", async () => {
                // Arrange
                const mockComment: Comment[] = [
                    { id: "1", authorId: "123", comment: "Test comment"},
                ];
    
                mockReq.params = { id: "1" };
                mockReq.body = {
                    authorId: "123",
                    comment: "Updated comment",
                };
    
                (commentService.updateComment as jest.Mock).mockReturnValue(mockComment);
    
                // Act
                await commentController.updateComment(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
    
                // Assert
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
                expect(mockRes.json).toHaveBeenCalledWith({
                    message: "Comment updated successfully",
                    data: mockComment,
                    status: "success",
                });
            });
    
    describe("deleteComment", () => {
        it("should handle successful operation", async () => {
            // Arrange
            const mockComment: Comment[] = [
                { id: "1", authorId: "123", comment: "Test comment"},
            ];

            mockReq.params = { id: "1" };
            mockReq.body = {
                authorId: "123",
                comment: "Updated comment",
            };

            (commentService.deleteComment as jest.Mock).mockReturnValue(mockComment);

            // Act
            await commentController.deleteComment(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: "Comment successfully deleted",
                message: undefined,
                status: "success",
            });
        });
    });
});
});