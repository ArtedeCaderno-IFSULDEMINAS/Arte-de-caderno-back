import StudentController from "../controllers/StudentController.js";
import express from "express";
import authenticateTokenJwt from '../middleware/authMiddleware.js';

const studentRoute = express.Router();
studentRoute.use(authenticateTokenJwt);

studentRoute
    .get("/student", StudentController.listStudent)
    .get("/student/:id", StudentController.getStudentById)
    .get("/student/:id/draws", StudentController.getDrawsByStudent)
    .post ("/student/update/:id", StudentController.updateStudent)
    .get("/student/getInfos/:id", StudentController.getInfoByStudent)
    .delete("/student/:id", StudentController.deleteStudent);

export default studentRoute;