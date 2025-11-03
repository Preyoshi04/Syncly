import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import noteRouter from "./routes/noteRouter.js";
import authRoutes from "./routes/auth.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use("/api/notes", noteRouter);
app.use("/api/users", authRoutes);

// Resolve __dirname for ES Modules
const __dirname = path.resolve();

// Serve frontend (for production)
if (process.env.NODE_ENV === "production") {
  // Serve static files from frontend/dist
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  // Handle all other routes by returning index.html (SPA fallback)
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  // Simple test route for development
  app.get("*", (req, res) => {
    res.send("API is running...");
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
