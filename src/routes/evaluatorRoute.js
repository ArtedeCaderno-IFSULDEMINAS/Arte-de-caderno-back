import express from 'express';
import EvaluatorController from '../controllers/EvaluatorController.js';
import authenticateTokenJwt from '../middleware/authMiddleware.js';

const evaluatorRoute = express.Router();
evaluatorRoute.use(authenticateTokenJwt);

evaluatorRoute.get('/evaluator', EvaluatorController.listEvaluators)
        .get('/evaluator/:id', EvaluatorController.getEvaluatorById)
        .post('/insertEvaluator', EvaluatorController.insertEvaluator)
        .get('/evaluator/:id/draws', EvaluatorController.getDrawsByEvaluator)
        .get('/evaluator/getInfos/:id', EvaluatorController.getInfosByEvaluator)
        
export default evaluatorRoute;