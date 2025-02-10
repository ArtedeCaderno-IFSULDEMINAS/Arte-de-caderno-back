import express from 'express';
import authenticateTokenJwt from '../middleware/authMiddleware.js';
import EnrollmentController from '../controllers/EnrollmentController.js'

const enrollmentRoute = express.Router();
enrollmentRoute.use(authenticateTokenJwt);

enrollmentRoute.post('/enrollments',  EnrollmentController.insertAcceptEnrollment)
.post('enrollments/:userId', EnrollmentController.findEnrollmentByUserId)
.get('/enrollments', EnrollmentController.listAllEnrollment);

export default enrollmentRoute;