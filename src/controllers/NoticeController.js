import { ERROR_MESSAGE } from "../constants/Messages.js"
import Notice from "../models/notice.js"

class NoticeController{

    listAllNotices = async (req, res, next) =>{
        try{
            const notices = await Notice.find()

            return res.status(200).json(notices)
        }
        catch(err){
            next(err)
        }
    }

    insertNotice = async (req, res, next) =>{
        const {start_submit, end_submit, start_evaluator, end_evaluator, notice_file} = req.body;

        if(!start_submit || !end_submit  || !start_evaluator|| !end_evaluator || !notice_file){
            return req.status(400).json({message: ERROR_MESSAGE.ALL_FIELDS_REQUIRED});
        }

        if(start_submit > end_submit || start_evaluator > end_evaluator){
            return req.status(400).json({message: "Invalid date"});
        }

        try{
            const noticeExists = await Notice.findOne({notice_file: notice_file})

            if(noticeExists !== null){
                return res.status(400).json({message: "Notice already exists"});
            }

            const notice = new Notice ({
                create_date: Date.now(),
                end_evaluate_date: end_evaluator,
                start_evaluate_date: start_evaluator,
                end_submit_date: end_submit,
                start_submit_date: start_submit,
                notice_file: notice_file,
            })

            const newNotice = await notice.save();
            res.status(201).json(newNotice);
        }
        catch(err){
            next(err);
        }

    }

    updateNotice = async (req, res, next) => {
        const { id } = req.params;
        const update = req.body;

        try{
            const noticeUpdate = await Notice.findByIdAndUpdate(
                id,
                {$set: update},
                {new: true}
            )

            if(noticeUpdate === null){
                return res
                .status(404)
                .json({ message: "NOTICE NOT FOUND" });
            }

            return res.status(200).json(noticeUpdate);
        }

        catch(err){
            next(err)
        }
    }

    getNoticeById = async (req, res, next) => {
        try{
            const {id} = req.params;
            const notice = await Notice.findById(id);

            if(notice === null){
                return res
                .status(404)
                .json({ message: "NOTICE NOT FOUND" });
            }

            return res.status(200).json(notice)
        }
        catch(err){
            next(err);
        }
    }

    getActiveNotice = async (req, res, next) => {
        try{
            const notice = Notice.findOne({active: true});

            if(notice === null){
                return res.status(404).json({message: "NOTICE NOT FOUND"})
            }

            return res.status(200).json(notice);
        }

        catch(err){
            next(err);
        }
    }
    
}

export default new NoticeController();