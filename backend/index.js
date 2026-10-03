import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import studentRoutes from "./routes/students.routes.js";
import courseRoutes from "./routes/courses.routes.js";
import enrollmentRoutes from "./routes/enrollments.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;
