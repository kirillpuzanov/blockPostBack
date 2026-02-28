import { matchedData } from "express-validator";
import { Request } from "express";

export const getMatchedQuery = <T extends object>(req: Request): T => {
  const matchedQuery = matchedData<T>(req, {
    locations: ["query"],
    includeOptionals: true,
  });

  return {
    ...req.query,
    ...matchedQuery,
  };
};
