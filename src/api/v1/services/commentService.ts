import { Comment } from "../models/commentModel";
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

const COLLECTION: string = "comments";

/**
 * Retrieves all comments from comments array
 * @returns Array of all the comments
 */
export const getAllComments = async (): Promise<Comment[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const comments: Comment[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Comment;
        });
        return comments;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Retrieves the comment object for the specified ID
 * @param id - The ID of the comment that will be retrieved
 * @returns The comment object for the specified ID
 * @throws Error if comment is not found
 */
export const getCommentById = async (id: string): Promise<Comment> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

        if (!doc) {
            throw new Error(`Comment with ID ${id} not found`);
        }

        const data: DocumentData | undefined = doc.data();
        const comment: Comment = {
            id: doc.id,
            ...data,
        } as Comment;

        return structuredClone(comment);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new comment
 * @param commentData - The data for the new comment
 * @returns The created comment with generated ID
 */
export const createComment = async (commentData: {
    comment: string;
    authorId: string;
}): Promise<Comment> => {
    try {
        const newComment: Partial<Comment> = { ...commentData };

        const commentId: string = await createDocument<Comment>(COLLECTION, newComment);

        return structuredClone({ id: commentId, ...newComment } as Comment);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Updates (replaces) an existing comment
 * @param id - The ID of the comment to update
 * @param commentData - The fields to updates
 * @returns The updated comment
 * @throws Error if comment with given ID is not found
 */
export const updateComment = async (
    id: string,
    commentData: Partial<Pick<Comment, "comment">>
): Promise<Comment> => {
    try {
        const comment: Comment = await getCommentById(id);
        if (!comment) {
            throw new Error(`Comment with ID ${id} not found`);
        }

        const updatedComment: Comment = { ...comment };

        if (commentData.comment !== undefined) updatedComment.comment = commentData.comment;

        await updateDocument<Comment>(COLLECTION, id, updatedComment);

        return structuredClone(updatedComment);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Deletes a comment from the array
 * @param id - The ID of the comment to delete
 * @throws Error if comment with given ID is not found
 */
export const deleteComment = async (id: string): Promise<void> => {
    try {
        const comment: Comment = await getCommentById(id);
        if (!comment) {
            throw new Error(`Comment with ID ${id} not found`);
        }

        await deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        throw error;
    }
};