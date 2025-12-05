import { Category } from "../models/categoryModel";
import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

const COLLECTION: string = "categories";

/**
 * Retrieves all categories from categories array
 * @returns Array of all the categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const categories: Category[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Category;
        });
        return categories;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Retrieves the category object for the specified ID
 * @param id - The ID of the category that will be retrieved
 * @returns The category object for the specified ID
 * @throws Error if category is not found
 */
export const getCategoryById = async (id: string): Promise<Category> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

        if (!doc) {
            throw new Error(`Category with ID ${id} not found`);
        }

        const data: DocumentData | undefined = doc.data();
        const category: Category = {
            id: doc.id,
            ...data,
        } as Category;

        return structuredClone(category);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new category
 * @param categoryData - The data for the new category
 * @returns The created category with generated ID
 */
export const createCategory = async (categoryData: {
    name: string;
    description?: string;
}): Promise<Category> => {
    try {
        const newCategory: Partial<Category> = { ...categoryData };

        const categoryId: string = await createDocument<Category>(COLLECTION, newCategory);

        return structuredClone({ id: categoryId, ...newCategory } as Category);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Updates (replaces) an existing category
 * @param id - The ID of the category to update
 * @param categoryData - The fields to updates
 * @returns The updated category
 * @throws Error if category with given ID is not found
 */
export const updateCategory = async (
    id: string,
    categoryData: Partial<Pick<Category, "name">>
): Promise<Category> => {
    try {
        const category: Category = await getCategoryById(id);
        if (!category) {
            throw new Error(`Category with ID ${id} not found`);
        }

        const updatedCategory: Category = { ...category };

        if (categoryData.name !== undefined) updatedCategory.name = categoryData.name;

        await updateDocument<Category>(COLLECTION, id, updatedCategory);

        return structuredClone(updatedCategory);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Deletes a category from the array
 * @param id - The ID of the category to delete
 * @throws Error if category with given ID is not found
 */
export const deleteCategory = async (id: string): Promise<void> => {
    try {
        const category: Category = await getCategoryById(id);
        if (!category) {
            throw new Error(`Category with ID ${id} not found`);
        }

        await deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        throw error;
    }
};