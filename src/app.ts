import { toNodeHandler } from "better-auth/node";
import express from "express";
import cors from "cors";
import { auth } from "./lib/auth";
import { TutorRouter } from "./modules/tutor/tutor.route";
import { UserRouter } from "./modules/user/user.route";
import { CategoryRouter } from "./modules/category/category.route";
import { BookingRouter } from "./modules/booking/booking.route";
import { ReviewRouter } from "./modules/review/review.route";
import { AdminRouter } from "./modules/admin/admin.route";
import { notFound } from "./middlewares/notFound";
import errorHandler from "./middlewares/globalErrorHandler";

const app = express();

// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL, // Production frontend URL
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5000",
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use("/api/auth", UserRouter);
app.all("/api/auth/*splat", toNodeHandler(auth));

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

// routes
app.use("/api/tutors", TutorRouter);
app.use("/api/categories", CategoryRouter);
app.use("/api/bookings", BookingRouter);
app.use("/api/reviews", ReviewRouter);
app.use("/api/admin", AdminRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: `SkillBridge app is running.`,
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
