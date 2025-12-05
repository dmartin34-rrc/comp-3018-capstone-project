/**
 * Represents a review in the system
 */
export interface Review {
  id: string;
  authorId: string;
  title: string;
  content: string;
  rating: number;
}
