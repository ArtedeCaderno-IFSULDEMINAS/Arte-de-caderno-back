import express from 'express';
import NoticeController from '../controllers/NoticeController.js'
import authenticateTokenJwt from '../middleware/authMiddleware.js';

const noticeRoute = express.Router();

noticeRoute.use(authenticateTokenJwt);

noticeRoute.get('/notice', NoticeController.listAllNotices)
            .post('/notice', NoticeController.insertNotice)
            .post('/notice/:id', NoticeController.updateNotice)
            .get('/notice/:id', NoticeController.getNoticeById)
            .get('/activeNotice', NoticeController.getActiveNotice);


export default noticeRoute;
