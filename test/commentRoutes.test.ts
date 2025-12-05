import request from "supertest";
import { Request, Response, NextFunction } from "express";
import app from "../src/app";
import * as commentController from "../src/api/v1/controllers/commentController";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/controllers/commentController", () => ({
    getAllComments: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).send()
    ),
    getCommentById: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).send()
    ),
    createComment: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.CREATED).send()
    ),
    updateComment: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).send()
    ),
    deleteComment: jest.fn((_req: Request, res: Response) =>
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

describe("Comment Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/comments/", () => {
        it("should call getAllComments controller", async () => {
            await request(app).get("/api/v1/comments/");
            expect(commentController.getAllComments).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/comments/", () => {
        it("should call createComment controller with valid data", async () => {
            const mockComment = {
                authorId: "12",
                comment: "Test comment",
            };

            await request(app)
                .post("/api/v1/comments/")
                .set("Authorization", "Bearer mockedToken")
                .send(mockComment);
            expect(commentController.createComment).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/comments/:id", () => {
        it("should call updateComment controller with valid data", async () => {
            const mockComment = {
                authorId: "123",
                comment: "Test comment",
            };

            await request(app)
                .put("/api/v1/comments/testId")
                .set("Authorization", "Bearer mockedToken")
                .send(mockComment);
            expect(commentController.updateComment).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/comments/:id", () => {
        it("should call deleteComment controller with valid data", async () => {
            await request(app)
                .delete("/api/v1/comments/testId")
                .set("Authorization", "Bearer mockedToken");
            expect(commentController.deleteComment).toHaveBeenCalled();
        });
    });
});
