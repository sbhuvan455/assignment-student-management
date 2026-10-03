import Enrollment from "../models/enrollments.models.js";
import { Student } from "../models/students.models.js";
import Course from "../models/courses.models.js";

export const createEnrollment = async (req, res) => {
  try {
    const { student, course, enrollmentDate } = req.body;

    const existingStudent = await Student.findById(student);

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const existingCourse = await Course.findById(course);

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      student,
      course,
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      student,
      course,
      enrollmentDate,
    });

    await enrollment.populate([
      {
        path: "student",
        select: "name email phone",
      },
      {
        path: "course",
        select: "courseName duration",
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Student enrolled successfully",
      data: enrollment,
    });
  } catch (error) {

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(
        (err) => err.message
      );

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create enrollment",
      error: error.message,
    });
  }
};

export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email phone")
      .populate("course", "courseName duration")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
      error: error.message,
    });
  }
};