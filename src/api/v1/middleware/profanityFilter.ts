import { Request, Response, NextFunction } from "express";
import leoProfanity from "leo-profanity";

/**
 * Checks multiple fields in req.body for profanity.
 * @param fields Array of string keys to check, Example: ["title", "content"]
 */
const profanityFilter = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of fields) {
      const text = req.body[field];
      if (typeof text === "string" && leoProfanity.check(text)) {
        return res.status(400).json({ message: `GOD DAMN IT FUCK! Profanity is NOT ALLOWED in ${field}` });
      }
    }
    next();
  };
};

export default profanityFilter;
