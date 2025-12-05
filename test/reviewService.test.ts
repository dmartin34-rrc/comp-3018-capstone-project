import * as reviewService from "../src/api/v1/services/reviewService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Review } from "../src/api/v1/models/reviewModel";

// Mock the repository module

jest.mock('../config/firebaseConfig', () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Review Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a review successfully", async () => {
        // Arrange
        const mockReviewData: {
            title: string;
            content: string;
            rating: number;
        } = {
            title: "Test title",
            content: "Test content",
            rating: 10,
        };
        const mockDocumentId: string = "test-item-id";

        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
            mockDocumentId
        );

        // Act
        const result: Review = await reviewService.createReview(mockReviewData);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "reviews",
            expect.objectContaining({
                title: mockReviewData.title,
                content: mockReviewData.content,
                rating: mockReviewData.rating
            })
        );
        expect(result.id).toBe(mockDocumentId);
        expect(result.title).toBe(mockReviewData.title);
    });

    it("should delete a review successfully", async () => {
        // Arrange
        const mockDocumentId: string = "test-item-id";
        const mockReview: Review = {
            id: mockDocumentId,
            authorId: "12",
            title: "Test title",
            content: "Test content",
            rating: 10,
        };

        // jest.spyOn creates a mock for a specific method/function on an object, in our example the itemService
        jest.spyOn(reviewService, "getReviewById").mockResolvedValue(mockReview);

        // jest.Mock replaces the auto-mocked version with our specific mocked implementation
        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        // Act
        await reviewService.deleteReview(mockDocumentId);

        // Assert
        expect(reviewService.getReviewById).toHaveBeenCalledWith(mockDocumentId);
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
            "reviews",
            mockDocumentId
        );
    });
});
