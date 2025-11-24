import * as commentService from "../src/api/v1/services/commentService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Comment } from "../src/api/v1/models/commentModel";

// Mock the repository module

jest.mock('../config/firebaseConfig', () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Comment Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a comment successfully", async () => {
        // Arrange
        const mockCommentData: {
            authorId: string;
            comment: string;
        } = {
            authorId: "21234",
            comment: "Test",
        };
        const mockDocumentId: string = "test-item-id";

        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
            mockDocumentId
        );

        // Act
        const result: Comment = await commentService.createComment(mockCommentData);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "comments",
            expect.objectContaining({
                comment: mockCommentData.comment,
            })
        );
        expect(result.id).toBe(mockDocumentId);
        expect(result.comment).toBe(mockCommentData.comment);
    });

    it("should delete a comment successfully", async () => {
        // Arrange
        const mockDocumentId: string = "test-item-id";
        const mockComment: Comment = {
            id: mockDocumentId,
            authorId: "1234",
            comment: "Test",
        };

        // jest.spyOn creates a mock for a specific method/function on an object, in our example the itemService
        jest.spyOn(commentService, "getCommentById").mockResolvedValue(mockComment);

        // jest.Mock replaces the auto-mocked version with our specific mocked implementation
        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        // Act
        await commentService.deleteComment(mockDocumentId);

        // Assert
        expect(commentService.getCommentById).toHaveBeenCalledWith(mockDocumentId);
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
            "comments",
            mockDocumentId
        );
    });
});
