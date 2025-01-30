import express from 'express';
import authenticateTokenJwt from '../middleware/authMiddleware.js';
import ReviewController from '../controllers/ReviewController.js'

const reviewRoute = express.Router();
reviewRoute.use(authenticateTokenJwt);

reviewRoute.post('/review/:id', ReviewController.evaluateDraw)
    .get('/review', ReviewController.listReviews)
    .get('/review/draw/:id', ReviewController.findDrawReviews)
    .get ('/review/evaluator/:id', ReviewController.findEvaluatorReviews);

export default reviewRoute;
