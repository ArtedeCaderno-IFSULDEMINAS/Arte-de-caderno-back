import Draw from "../models/draw.js";
import Student from "../models/student.js";
import { ERROR_MESSAGE } from "../constants/Messages.js";
import Notice from "../models/notice.js";

class DrawController {

    listClassifiedDraws = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = { classified: true };
            const draws = await Draw.find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ score: 1 });
            res.status(200).json(draws);
        }
        catch (err) {
            next(err);
        }
    }

    listAllDraws = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const draws = await Draw.find()
                .skip((page - 1) * limit)
                .limit(limit);
            res.status(200).json(draws);
        }
        catch (err) {
            next(err);
        }
    }

    getDrawById = async (req, res, next) => {
        const { id } = req.params;
        try {
            const draw = await Draw.findById(id);
            if(draw === null){
                return res.status(404).json({message: ERROR_MESSAGE.DRAW_NOT_FOUND});
            }
            res.status(200).json(draw);
        }
        catch (err) {
            next(err);
        }
    }

    getDrawByStudent = async (req, res, next) => {
        const { id } = req.params;
        try {
            const student = await Student.findById(id);
            if(student === null){
                return res.status(404).json({ message: ERROR_MESSAGE.STUDENT_NOT_FOUND});
            }
            const draws = await Draw.find({ author: id });
            res.status(200).json(draws);
        }
        catch (err) {
            next(err);
        }
    }

    insertDraw = async (req, res, next) => {
        try {
            const { title, category, author} = req.body;
            if(!title || !category || !author ){
                return res.status(400).json({ message: ERROR_MESSAGE.ALL_FIELDS_REQUIRED });
            }

            const student = await Student.findById(author);

            if(student === null){
                return res.status(404).json({ message: ERROR_MESSAGE.STUDENT_NOT_FOUND});
            }

            const notice = await Notice.findOne({active: true});

            if(notice === null){
                return res.status(400).json({message: "NENHUM EDITAL ATIVO"});
            }

            const now = new Date();

            // Verifica se a data atual está dentro do período de submissão
            if (now < new Date(notice.start_submit_date) || now > new Date(notice.end_submit_date)) {
                return res.status(400).json({ message: "Submissão não permitida. Fora do período válido." });
            }

            if(student.drawsId.length >= notice.maxNumberOfDrawsPerStudent){
                return res.status(400).json({ message: ERROR_MESSAGE.STUDENT_ALREADY_HAS_THREE_DRAWS});
            }

            const draw = new Draw({
                title: title,
                category: category,
                author: author,
                linkImage: req.files.image[0].filename,
                notice: notice._id,
                review: []
            });

            await draw.save();

            student.drawsId.push(draw._id);

            await student.save();

            notice.draws.push(draw._id);

            await notice.save();

            return res.status(201).json(draw);
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }

    getDrawByCategory = async (req, res, next) => {
        const { category } = req.body;
        try {
            if(category !== "ninja" && category !== "superninja"){
                return res.status(400).json({ message: ERROR_MESSAGE.CATEGORY_NOT_FOUND });
            }
            const draws = await Draw.find({ category: category });
            res.status(200).json(draws);
        }
        catch (err) {
            next(err);
        }
    }
}

export default new DrawController;