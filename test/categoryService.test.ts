import * as categoryService from "../src/api/v1/services/categoryService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Category } from "../src/api/v1/models/categoryModel";

// Mock the repository module

jest.mock('../config/firebaseConfig', () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Category Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a category successfully", async () => {
        // Arrange
        const mockCategoryData: {
            name: string;
        } = {
            name: "Test name",
        };
        const mockDocumentId: string = "test-item-id";

        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
            mockDocumentId
        );

        // Act
        const result: Category = await categoryService.createCategory(mockCategoryData);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "categories",
            expect.objectContaining({
                name: mockCategoryData.name,
            })
        );
        expect(result.id).toBe(mockDocumentId);
        expect(result.name).toBe(mockCategoryData.name);
    });

    it("should delete a category successfully", async () => {
        // Arrange
        const mockDocumentId: string = "test-item-id";
        const mockCategory: Category = {
            id: mockDocumentId,
            name: "Test",
        };

        // jest.spyOn creates a mock for a specific method/function on an object, in our example the itemService
        jest.spyOn(categoryService, "getCategoryById").mockResolvedValue(mockCategory);

        // jest.Mock replaces the auto-mocked version with our specific mocked implementation
        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        // Act
        await categoryService.deleteCategory(mockDocumentId);

        // Assert
        expect(categoryService.getCategoryById).toHaveBeenCalledWith(mockDocumentId);
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
            "categories",
            mockDocumentId
        );
    });
});
