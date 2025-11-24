import request from "supertest";
import { Request, Response, NextFunction } from "express";
import app from "../src/app";
import * as categoryController from "../src/api/v1/controllers/categoryController";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/controllers/categoryController", () => ({
    getAllCategories: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).send()
    ),
    getCategoryById: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).send()
    ),
    createCategory: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.CREATED).send()
    ),
    updateCategory: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).send()
    ),
    deleteCategory: jest.fn((_req: Request, res: Response) =>
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

describe("Category Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/categories/", () => {
        it("should call getAllCategories controller", async () => {
            await request(app).get("/api/v1/categories/");
            expect(categoryController.getAllCategories).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/categories/", () => {
        it("should call createCategory controller with valid data", async () => {
            const mockCategory = {
                title: "Test Title",
                content: "Test content",
                rating: 10,
            };

            await request(app)
                .post("/api/v1/categories/")
                .set("Authorization", "Bearer mockedToken")
                .send(mockCategory);
            expect(categoryController.createCategory).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/categories/:id", () => {
        it("should call updateCategory controller with valid data", async () => {
            const mockCategory = {
                title: "Test Title",
                content: "Test content",
                rating: 10,
            };

            await request(app)
                .put("/api/v1/categories/testId")
                .set("Authorization", "Bearer mockedToken")
                .send(mockCategory);
            expect(categoryController.updateCategory).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/categories/:id", () => {
        it("should call deleteCategory controller with valid data", async () => {
            await request(app)
                .delete("/api/v1/categories/testId")
                .set("Authorization", "Bearer mockedToken");
            expect(categoryController.deleteCategory).toHaveBeenCalled();
        });
    });
});
