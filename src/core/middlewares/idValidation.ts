import { param } from "express-validator";

export const handleIdValidation = (idKey = "id") => {
  return param(idKey)
    .exists()
    .withMessage(`${idKey} is required`)
    .isString()
    .withMessage(`${idKey} is not valid type`)
    .isMongoId()
    .withMessage("incorrect format of ObjectId");
};
