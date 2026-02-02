import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let message = "Internal Server Error";
  let details: unknown = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid or missing fields in request";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;

    switch (err.code) {
      case "P2025":
        message = "Operation failed because the required record was not found";
        break;

      case "P2002":
        message = "Duplicate key error";
        break;

      case "P2003":
        message = "Foreign key constraint failed";
        break;

      default:
        message = "Database request error";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    message = "Unknown error occurred during database query execution";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    switch (err.errorCode) {
      case "P1000":
        statusCode = 401;
        message = "Authentication failed. Check database credentials";
        break;

      case "P1001":
        statusCode = 503;
        message = "Unable to reach database server";
        break;

      default:
        message = "Database initialization error";
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: process.env.NODE_ENV === "production" ? undefined : details,
  });
}

export default errorHandler;
