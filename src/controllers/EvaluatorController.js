import { ERROR_MESSAGE } from "../constants/Messages.js";
import Draw from "../models/draw.js";
import Evaluator from "../models/evaluator.js";
import createHashWithSalt from "../middleware/hashWithSalt.js";
import Login from "../models/login.js";
import transporter from "../middleware/emailConfig.js";
import  crypto from 'crypto';

class EvaluatorController {

    listEvaluators = async (req, res, next) => {
        try{
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10; 
            const evaluators = await Evaluator.find()
                    .skip((page - 1) * limit)
                    .limit(limit);
            res.status(200).json(evaluators);
        }
        catch(err){
            next(err);
        }
    }

    getEvaluatorById = async (req, res, next) => {
        const {id} = req.params;
        try{
            const evaluator = await Evaluator.findById(id);
            if(evaluator === null){
                return res.status(404).json({message: ERROR_MESSAGE.EVALUATOR_NOT_FOUND});
            }
            const response = {
                user: evaluator,
                accessType: 'evaluator'
            };
            
            res.status(200).json(response);
        }
        catch(err){
            next(err);
        }
    }

    insertEvaluator = async (req, res, next) => {
        const {name, email, cpf} = req.body;

        if(!cpf|| !name|| !email){
            return res.status(400).json({ message: ERROR_MESSAGE.ALL_FIELDS_REQUIRED});
        }

        const loginExists = await Login.findOne({username: cpf});

        if(loginExists !== null){
            return res.status(400).json({message: ERROR_MESSAGE.USER_ALREADY_EXISTS});
        }

        const randomPassword = this.generateRandomPassword(8);
        const hashPassword = await createHashWithSalt(randomPassword);

        const login = new Login({
            username: cpf,
            password: hashPassword,
            accessType: 'evaluator',
            firstAccess: true
        });

        async function sendEmail() {
            const mailSent = await transporter.sendMail({
                subject: 'Senha para primeiro acesso',
                from: 'Equipe Arte de Caderno <artedecaderno.if@gmail.com>',
                to: email,
                html: `<p>Sua senha inicial para acessar a plataforma é:</p>
                <p style="color: DarkMagenta; font-size: 25px; letter-spacing: 2px;">
                  <b>${randomPassword}</b>
                </p>
                <p><b>Ao fazer o primeiro acesso, você deve alterar a senha.</b>.</p>`

            })};

        sendEmail();

        try{
            const newLogin = await login.save();

            if(newLogin == null){
                return res.status(400).json({ message: ERROR_MESSAGE.SAVE_DOCUMENT_ERROR});
               }

            const evaluator = new Evaluator({
                name: name,
                email: email,
                cpf: cpf,
                loginId: newLogin._id
            });
            const newEvaluator = await evaluator.save();
            res.status(201).json(newEvaluator);
        }
        catch(err){
            next(err);
        }
    }

    getDrawsByEvaluator = async (req, res, next) => {
        const {id} = req.params;
        try{
            const evaluator = await Evaluator.findById(id);
            if(evaluator === null){
                return res.status(404).json({message: ERROR_MESSAGE.EVALUATOR_NOT_FOUND});
            }
            const draws = evaluator.draws;

            const resDraws = [];
            for (const draw of draws){
                const findDraw = await Draw.findById(draw);

                resDraws.push(findDraw);
            }
            return res.status(200).json(resDraws)
        }
        catch(err){
            next(err);
        }
    }

    generateRandomPassword(length) {
        return crypto
          .randomBytes(length)
          .toString('base64')  
          .slice(0, length)    
          .replace(/[+/]/g, ''); 
    }

    getInfosByEvaluator= async (req, res, next)=>{
        const {id} = req.params;

        var numberOfDrawsPendent = 0;
        var numberOfDrawsApproved = 0;
        var numberOfDrawsReproved = 0;
        var numberOfDrawsWithoutEvaluate = 0;
        var numberOfDrawsWithEvaluate = 0;
        var numberOfDraws = 0;
        try{
            const evaluator = await Evaluator.findById(id);

            if(evaluator === null){
                return res.status(404).json({message: ERROR_MESSAGE.EVALUATOR_NOT_FOUND})
            }
            numberOfDraws = evaluator.draws.length;

            for(const drawId of evaluator.draws){
                const draw = await Draw.findById(drawId);

                if(draw.classified == "Pendente"){
                    numberOfDrawsPendent ++;
                }
        
                if(draw.classified == "Reprovado"){
                    numberOfDrawsReproved ++;
                }
        
                if(draw.classified == "Aprovado"){
                    numberOfDrawsApproved ++;
                }

                if(draw.reviewFinished){
                    numberOfDrawsWithEvaluate ++;
                }

                else{
                    numberOfDrawsWithoutEvaluate++;
                }
            }

            return res.status(200).json({
                numberOfDrawsPendent :numberOfDrawsPendent,
                numberOfDrawsApproved :numberOfDrawsApproved,
                numberOfDrawsReproved :numberOfDrawsReproved,
                numberOfDrawsWithoutEvaluate :numberOfDrawsWithoutEvaluate,
                numberOfDrawsWithEvaluate :numberOfDrawsWithEvaluate,
                numberOfDraws :numberOfDraws,
            })
        }
        catch(err){
            next(err);
        }
    }
    
}

export default new EvaluatorController;