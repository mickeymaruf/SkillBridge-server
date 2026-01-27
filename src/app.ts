import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./lib/auth";
import { TutorRouter } from "./modules/tutor/tutor.route";
import { UserRouter } from "./modules/user/user.route";
import { CategoryRouter } from "./modules/category/category.route";

const app = express();

app.use("/api/auth", UserRouter);
app.all("/api/auth/*splat", toNodeHandler(auth));

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

// routes
app.use("/api/tutors", TutorRouter);
app.use("/api/categories", CategoryRouter);
app.use("/api/categories", CategoryRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: `SkillBridge app is running.`,
  });
});

export default app;
