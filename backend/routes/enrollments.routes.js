import express from "express";

import {
  createEnrollment,
  getEnrollments,
} from "../controllers/enrollment.controller.js";

const router = express.Router();


router
  .route("/")
  .get(getEnrollments)
  .post(createEnrollment);

export default router;