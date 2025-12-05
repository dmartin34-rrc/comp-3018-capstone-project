import request from "supertest";
import { Request, Response, NextFunction } from "express";
import app from "../src/app";
import * as reviewController from "../src/api/v1/controllers/reviewController";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/controllers/reviewController", () => ({
    getAllReviews: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).send()
    ),
    getReviewById: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).send()
    ),
    createReview: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.CREATED).send()
    ),
    updateReview: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).send()
    ),
    deleteReview: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).send()
    ),
}));

// Mocking authentication, essentially bypassing the actual authentication process by calling next()
jest.mock("../src/api/v1/middleware/authenticate", () => {
    return jest.fn((_req: Request, _res: Response, next: NextFunction) =>
        next()
    );
});

// Mocking authorization, essentially bypassing the actual authentication process by calling next() and passing empty _options
jest.mock("../src/api/v1/middleware/authorize", () => {
    return jest.fn(
        (_mockOptions) => (_req: Request, _res: Response, next: NextFunction) =>
            next()
    );
});

// Mocking validation, essentially bypassing the actual validation process by calling next()
jest.mock("../src/api/v1/middleware/validate", () => ({
    validateRequest: jest.fn(() => (_req: Request, _res: Response, next: NextFunction) =>
        next()
    ),
}));

describe("Review Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/reviews/", () => {
        it("should call getAllReviews controller", async () => {
            await request(app).get("/api/v1/reviews/");
            expect(reviewController.getAllReviews).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/reviews/", () => {
        it("should call createReview controller with valid data", async () => {
            const mockReview = {
                title: "Test Title",
                content: "Test content",
                rating: 10,
            };

            await request(app)
                .post("/api/v1/reviews/")
                .set("Authorization", "Bearer mockedToken")
                .send(mockReview);
            expect(reviewController.createReview).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/reviews/:id", () => {
        it("should call updateReview controller with valid data", async () => {
            const mockReview = {
                title: "Test Title",
                content: "Test content",
                rating: 10,
            };

            await request(app)
                .put("/api/v1/reviews/testId")
                .set("Authorization", "Bearer mockedToken")
                .send(mockReview);
            expect(reviewController.updateReview).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/reviews/:id", () => {
        it("should call deleteReview controller with valid data", async () => {
            await request(app)
                .delete("/api/v1/reviews/testId")
                .set("Authorization", "Bearer mockedToken");
            expect(reviewController.deleteReview).toHaveBeenCalled();
        });
    });
});
