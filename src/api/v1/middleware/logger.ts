import morgan from "morgan";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";

// ensure the logs directory actually exists '/logs'
const logsDirectory: string = path.join(__dirname, "../../../logs");
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory, { recursive: true });
}

// creating a write stream for access logs i.e. any time there is a request to my api. 'a' === append file
const accessLogStream = fs.createWriteStream(
    path.join(logsDirectory, "access.log"),
    { flags: "a" }
);

// creating a write stream for eror logs i.e. any request that is error level status codes. 'a' === append file
const errorLogStream = fs.createWriteStream(
    path.join(logsDirectory, "errog.log"),
    { flags: "a" }
);

const accessLogger = morgan("combined", { stream: accessLogStream });

// only logging requests if the status code is 4XX or 5XX codes (error level codes)
const errorLogger = morgan("combined", {
    stream: errorLogStream,
    skip: (_req: Request, res: Response) => res.statusCode < 400,
});

const consoleLogger = morgan("dev");

export { accessLogger, errorLogger, consoleLogger };
