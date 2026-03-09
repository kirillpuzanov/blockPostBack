import { Request, Response } from "express";
import { errorHandler } from "../../../../core/errors/error.handler";
import { usersService } from "../../application/users.service";
import { HTTP_STATUS } from "../../../../core/const/statuses";

export const deleteUserHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    await usersService.deleteOne(req.params.id);
    res.sendStatus(HTTP_STATUS.noContent);
    return;
  } catch (error) {
    errorHandler(error, res);
  }
};
