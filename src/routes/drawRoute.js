import express from 'express';
import authenticateTokenJwt from '../middleware/authMiddleware.js';
import DrawController from '../controllers/DrawController.js';
import multer from 'multer';
import storage from '../config/multer.js';

const drawRoute = express.Router();
drawRoute.use(authenticateTokenJwt);

const upload = multer({ storage: storage });

drawRoute.get('/draw/all', DrawController.listAllDraws)
        .get('/draw/:id', DrawController.getDrawById)
        .get('/draw/student/:id', DrawController.getDrawByStudent)
        .post('/draw/category', DrawController.getDrawByCategory)
        .post('/draw', upload.fields([{name: 'image'}, {name: 'title'}, {name: 'author'}, {name: 'cathegory'}, {name: 'novice'}]), DrawController.insertDraw);

export default drawRoute;