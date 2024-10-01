import Draw from "../models/draw.js";
import Evaluator from "../models/evaluator.js";
import Student from "../models/student.js";
import { ERROR_MESSAGE } from "../constants/Messages.js";
import Log from "../models/log.js";
import { LOG_TYPES } from "../constants/LogTypes.js";

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
            const { title, category, author, novice } = req.body;
            if(!title || !category || !author ||!novice){
                return res.status(400).json({ message: ERROR_MESSAGE.ALL_FIELDS_REQUIRED });
            }

            const student = await Student.findById(author);

            if(student === null){
                return res.status(404).json({ message: ERROR_MESSAGE.STUDENT_NOT_FOUND});
            }

            if(student.drawsId.length >= 3){
                return res.status(400).json({ message: ERROR_MESSAGE.STUDENT_ALREADY_HAS_THREE_DRAWS});
            }

            const draw = new Draw({
                title: title,
                category: category,
                author: author,
                linkImage: req.files.image[0].filename,
                novice: novice
            });

            await draw.save();
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

    desclassifiedDraw = async (req, res, next) => {
        const { id } = req.params;
        const { note } = req.body;
        try {
            const filter = { _id: id };
            const update = { classified: false, note: note, reviewFinished: true };
            const draw = await Draw.findOneAndUpdate(filter, update, { new: true });
            if(draw === null){
                return res.status(404).json({ message: ERROR_MESSAGE.DRAW_NOT_FOUND});
            }
            res.status(200).json(draw);
            Log.create({
                message: `Draw ${draw.id} desclassified`,
                stack: "",
                date: new Date(),
                type: LOG_TYPES.INFO
            });
            await Log.save();
        }
        catch (err) {
            next(err);
        }
    }

    evaluateDraw = async (req, res, next) => {
        const { id } = req.params;
        const { score, note, evaluatorId } = req.body;
        try {
            if(evaluatorId === null){
                return res.status(400).json({ message: ERROR_MESSAGE.ALL_FIELDS_REQUIRED });
            }
            const evaluator = await Evaluator.findById(evaluatorId);
            if(evaluator === null){
                return res.status(404).json({ message: ERROR_MESSAGE.EVALUATOR_NOT_FOUND});
            }
            if(note === null){
                return res.status(400).json({ message: ERROR_MESSAGE.ALL_FIELDS_REQUIRED });
            }
            if(score < 0 || score > 100){
                return res.status(400).json({ message: ERROR_MESSAGE.SCORE_MUST_BE_BETWEEN_0_AND_100});
            }
            const filter = { _id: id, "review.evaluator": evaluatorId };
            const update = { "review.$.score": score, "review.$.note": note, "review.$.date": Date.now(), "review.$.finished": true };
            const draw = await Draw.findOneAndUpdate(filter, update, { new: true });
            if(draw === null){
                return res.status(404).json({ message: ERROR_MESSAGE.DRAW_NOT_FOUND});
            }
            Log.create({
                message: `Draw ${draw.id} evaluated`,
                stack: "",
                date: new Date(),
                type: LOG_TYPES.INFO
            });
            await Log.save();
            res.status(200).json(draw);
        }
        catch (err) {
            next(err);
        }
    }

    distributeDraws = async (req, res, next) => {
        try {
            const draws = await Draw.find();
            const evaluators = await Evaluator.find();

            evaluators.sort(() => Math.random() - 0.5);
            draws.sort(() => Math.random() - 0.5);

            const evaluators1 = evaluators.slice(0, evaluators.length / 3);
            const evaluators2 = evaluators.slice(evaluators.length / 3, 2 * evaluators.length / 3);
            const evaluators3 = evaluators.slice(2 * evaluators.length / 3, evaluators.length);

            const maxDrawsGroup1 = Math.ceil(draws.length / evaluators1.length);
            const maxDrawsGroup2 = Math.ceil(draws.length / evaluators2.length);
            const maxDrawsGroup3 = Math.ceil(draws.length / evaluators3.length);

            for (let i = 0; i < draws.length; i++) {

                for(let j=0; j<=evaluators1.length; j++){
                    if(await this.verifyEvaluator(evaluators1[j], maxDrawsGroup1)){
                        await this.updateDrawAndEvaluator(draws[i]._id, evaluators1[j]._id)
                        break;
                    }
                }

                for(let j=0; j<=evaluators2.length; j++){
                    if(await this.verifyEvaluator(evaluators2[j], maxDrawsGroup2)){
                        await this.updateDrawAndEvaluator(draws[i]._id, evaluators2[j]._id)
                        break;
                    }
                }

                for(let j=0; j<=evaluators3.length; j++){
                    if(await this.verifyEvaluator(evaluators3[j], maxDrawsGroup3)){
                        await this.updateDrawAndEvaluator(draws[i]._id, evaluators3[j]._id)
                        break;
                    }
                }

            }
            Log.create({
                message: "Draws distributed",
                stack: "",
                date: new Date(),
                type: LOG_TYPES.INFO
            });
            await Log.save();
            res.status(200).json({ message: "Draws distributed" });

        }
        catch (err) {
            next(err);
        }
    }

    verifyEvaluator =async (evaluator, maxDraws) => {
        const updateEvaluator = await Evaluator.findById(evaluator._id);
        if (updateEvaluator.draws.length >= maxDraws) {
            return false;
        }
        return true;
    }

    updateDrawAndEvaluator = async (drawId, evaluatorId) => {
        await Draw.findOneAndUpdate({ _id: drawId }, { $push: { review: { evaluator: evaluatorId } } });
        await Evaluator.findOneAndUpdate({ _id: evaluatorId}, { $push: { draws: drawId} });
    }
}

export default new DrawController;