import express from 'express';
import loginRouter from './loginRoute.js';
import schoolRoute from './schoolRoute.js';
import professorRoute from './professorRoute.js';
import studentRoute from './studentRoute.js';
import registerRoute from './registerRoute.js';
import drawRoute from './drawRoute.js';
import cepRoute from './cepRoute.js';
import validatorCpfRoute from './validatorCpfRoute.js';
import evaluatorRoute from './evaluatorRoute.js';
import adminRoute from './adminRoute.js';
import noticeRoute from './noticeRoute.js';
import reviewRoute from './reviewRoute.js';
import enrollmentRoute from './enrollmentRoute.js'

const routes = (app) => {
  app.route('/').get((req, res) => {
    res.status(200).send('Health')
  })

  app.use(
    express.json(),
    validatorCpfRoute,
    cepRoute,
    registerRoute,
    loginRouter,
    schoolRoute,
    professorRoute,
    studentRoute,
    drawRoute,
    evaluatorRoute,
    adminRoute,
    noticeRoute,
    reviewRoute,
    enrollmentRoute
  )
}

export default routes