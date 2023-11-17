import express from 'express';
import authenticateTokenJwt from '../middleware/authMiddleware.js';
import AdminController from '../controllers/AdminController.js'

const adminRoute = express.Router();

adminRoute.get('/admin/all', AdminController.listAdmin)
        .get('/admin/id/:id', AdminController.getAdminById);

export default adminRoute;