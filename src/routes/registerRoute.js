import express from 'express';
import ProfessorController from '../controllers/ProfessorController.js';
import StudentController from '../controllers/StudentController.js';
import SchoolController from '../controllers/SchoolController.js';
import DrawController from '../controllers/DrawController.js';
import AdminController from '../controllers/AdminController.js';

const registerRoute = express.Router();

registerRoute.post('/insertProfessor', ProfessorController.insertProfessor)
            .post('/insertStudent', StudentController.insertStudent)
            .post('/insertSchool', SchoolController.insertSchool)
            .post("/school/city", SchoolController.listCitiesByUf)
            .get("/school/uf", SchoolController.listUfs)
            .post("/school/listByCity", SchoolController.listSchoolByCity)
            .get("/draw/classified", DrawController.listClassifiedDraws)
            .post("/admin/createAdmin", AdminController.createAdmin)

export default registerRoute;
