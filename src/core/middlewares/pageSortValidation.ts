import { query } from "express-validator";
import { SortDirection } from "../types/pageAndSort";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.desc;
const DEFAULT_SORT_BY = "createdAt";

export const pageSortValidation = <T extends string>(
  sortFields: Record<string, T>,
) => {
  const sortedFields = Object.values(sortFields);
  const directions = Object.values(SortDirection);

  return [
    query("pageNumber")
      .default(DEFAULT_PAGE_NUMBER)
      .isInt({ min: 1 })
      .withMessage("pageNumber must be is integer")
      .toInt(),
    query("pageSize")
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1, max: 200 })
      .withMessage("pageSize must be is integer")
      .toInt(),
    query("sortBy")
      .default(DEFAULT_SORT_BY)
      .isString()
      .isIn(sortedFields)
      .withMessage(`sortBy must be one of ${sortedFields.join(",")}`),
    query("sortDirection")
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(directions)
      .withMessage(`sortDirection must be one of ${directions.join(",")}`),
  ];
};
