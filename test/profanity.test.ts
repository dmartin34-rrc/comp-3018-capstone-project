import { Request, Response, NextFunction } from "express";
import profanityFilter from "../src/api/v1/middleware/profanityFilter";
import leoProfanity from "leo-profanity";

describe("Profanity Filter Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = { body: {} };
        mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        mockNext = jest.fn();
    });

    it("calls next if no profanity", () => {
        mockReq.body = { title: "Nice movie" };
        const middleware = profanityFilter(["title"]);
        middleware(mockReq as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it("returns 400 if profanity is present", () => {
        // Add a word to profanity list for testing
        leoProfanity.add("badword");

        mockReq.body = { title: "This is a badword" };
        const middleware = profanityFilter(["title"]);
        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "GOD DAMN IT FUCK! Profanity is NOT ALLOWED in title" });
        expect(mockNext).not.toHaveBeenCalled();
    });
});
