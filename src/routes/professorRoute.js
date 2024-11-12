import express from 'express';
import ProfessorController from '../controllers/ProfessorController.js';
import authenticateTokenJwt from '../middleware/authMiddleware.js';

const professorRoute = express.Router();
professorRoute.use(authenticateTokenJwt);

professorRoute.get('/professor', ProfessorController.listProfessor)
    .get('/professor/:id', ProfessorController.getProfessorById)
    .get('/professor/school/:id', ProfessorController.listSchoolByProfessorId)
    .get('/professor/student/:id', ProfessorController.listStudentsByProfessorId)
    .post('/professor/student/:id', ProfessorController.insertStudentByProfessorId)
    .post('/professor/update/:id', ProfessorController.updateProfessor) //em teste
    .delete('/professor/:id', ProfessorController.deleteProfessor)
    .get('/professor/getInfos/:id', ProfessorController.getInfoByProfessorId);

export default professorRoute;