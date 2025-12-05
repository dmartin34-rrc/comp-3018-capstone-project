import { Review } from "../models/reviewModel";
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

// reference to the firestore collection name
const COLLECTION: string = "reviews";

/**
 * Retrieves all reviews from reviews array
 * @returns Array of all the reviews
 */
export const getAllReviews = async (): Promise<Review[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const reviews: Review[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Review;
        });

        return reviews;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Retrieves the review object for the specified ID
 * @param id - The ID of the review that will be retrieved
 * @returns The review object for the specified ID
 * @throws Error if Review is not found
 */
export const getReviewById = async (id: string): Promise<Review> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            COLLECTION,
            id
        );

        if (!doc) {
            throw new Error(`Review with ID ${id} not found`);
        }

        const data: DocumentData | undefined = doc.data();
        const review: Review = {
            id: doc.id,
            ...data,
        } as Review;

        return structuredClone(review);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new review
 * @param reviewData - The data for the new branch (title, content, rating)
 * @returns The created branch with generated ID
 */
export const createReview = async (reviewData: {
    title: string;
    content: string;
    rating: number;
}): Promise<Review> => {
    try {
        const newReview: Partial<Review> = {
            ...reviewData,
        };

        const reviewId: string = await createDocument<Review>(
            COLLECTION,
            newReview
        );

        return structuredClone({ id: reviewId, ...newReview } as Review);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Updates (replaces) an existing review
 * @param id - The ID of the review to update
 * @param reviewData - The fields to updates
 * @returns The updated review
 * @throws Error if review with given ID is not found
 */
export const updateReview = async (
    id: string,
    reviewData: Partial<Pick<Review, "title" | "content" | "rating">>
): Promise<Review> => {
    try {
        const review: Review = await getReviewById(id);
        if (!review) {
            throw new Error(`Review with ID ${id} not found`);
        }

        const updatedReview: Review = {
            ...review,
        };

        if (reviewData.title !== undefined) updatedReview.title = reviewData.title;
        if (reviewData.content !== undefined) updatedReview.content = reviewData.content;
        if (reviewData.rating !== undefined) updatedReview.rating = reviewData.rating;

        await updateDocument<Review>(COLLECTION, id, updatedReview);

        return structuredClone(updatedReview);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Deletes a review from the array
 * @param id - The ID of the review to delete
 * @throws Error if review with given ID is not found
 */
export const deleteReview = async (id: string): Promise<void> => {
    try {
        // check if branch exists before deleting
        const review: Review = await getReviewById(id);
        if (!review) {
            throw new Error(`Review with ID ${id} not found`);
        }

        await deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        throw error;
    }
};