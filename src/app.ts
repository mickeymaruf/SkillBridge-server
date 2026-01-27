import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: `SkillBridge app is running.`,
  });
});

export default app;
