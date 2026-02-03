import { Request, Response, NextFunction } from "express";
import { Prisma } from "../../generated/prisma/client";
import { AppError } from "../lib/AppError";

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);

  let statusCode = 500;
  let errorMessage = "Internal Server Error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provided incorrect field type or missing fields!";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025":
        statusCode = 400;
        errorMessage =
          "Operation failed because one or more required records were not found.";
        break;
      case "P2002":
        statusCode = 400;
        errorMessage = "Duplicate key error";
        break;
      case "P2003":
        statusCode = 400;
        errorMessage = "Foreign key constraint failed";
        break;
      default:
        statusCode = 400;
        errorMessage = err.message;
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occurred during query execution";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    switch (err.errorCode) {
      case "P1000":
        statusCode = 401;
        errorMessage = "Authentication failed. Please check your credentials!";
        break;
      case "P1001":
        statusCode = 400;
        errorMessage = "Can't reach database server";
        break;
      default:
        statusCode = 500;
        errorMessage = err.message;
    }
  } else if (err instanceof AppError) {
    statusCode = err.status;
    errorMessage = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
  });
}
