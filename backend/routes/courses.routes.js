import express from "express";

import {
  getCourses,
  createCourse,
} from "../controllers/course.controller.js";

const router = express.Router();


router
  .route("/")
  .get(getCourses)
  .post(createCourse);

export default router;