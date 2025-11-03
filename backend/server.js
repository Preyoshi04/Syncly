import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import noteRouter from "./routes/noteRouter.js";
import authRoutes from "./routes/auth.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Use routes
app.use("/api/notes", noteRouter);
app.use("/api/users", authRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("/{*splat", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

connectDB();

app.listen(PORT, () => {
  console.log("Server started!", PORT);
});
