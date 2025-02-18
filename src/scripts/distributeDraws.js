import Notice from "../models/notice.js";
import Evaluator from "../models/evaluator.js";
import Review from "../models/review.js";
import Log from "../models/log.js";
import transporter from '../middleware/emailConfig.js';

import cron from 'node-cron';

export default async function distributeDraws(days_to_distribute, end_date){
    try{
        const notice = await Notice.findOne({active: true}).populate('draws');
        if (!notice) {
            console.log('Edital não encontrado ou inativo.');
            return;
        }


        const evaluators = await Evaluator.find();

        if (evaluators.length === 0) {
            console.log('Nenhum avaliador encontrado.');
            return;
        }

        const draws = notice.draws;
        const totalDraws = draws.length;
        const totalEvaluators = evaluators.length;

        const drawsPerEvaluator = Math.floor(totalDraws / totalEvaluators);
        const remainingDraws = totalDraws % totalEvaluators;

        let evaluatorIndex = 0;
        const evaluatorDraws = {};

        evaluators.forEach(evaluator => {
            evaluatorDraws[evaluator._id] = [];
        });

        const shuffledEvaluators = [...evaluators].sort(() => Math.random() - 0.5);

        for (let i = 0; i < totalDraws; i++) {
            const drawId = draws[i];
            const assignedEvaluators = [];

            while (assignedEvaluators.length < 3) {
                const randomEvaluator = shuffledEvaluators[evaluatorIndex];

                if (
                    evaluatorDraws[randomEvaluator._id].assignedDraws < drawsPerEvaluator ||
                    (evaluatorDraws[randomEvaluator._id].assignedDraws === drawsPerEvaluator && remainingDraws > 0)
                ) {
                    assignedEvaluators.push(randomEvaluator._id);
                    evaluatorDraws[randomEvaluator._id].assignedDraws++;
                    evaluatorDraws[randomEvaluator._id].draws.push(drawId);
                    if (evaluatorDraws[randomEvaluator._id].assignedDraws > drawsPerEvaluator) {
                        remainingDraws--; 
                    }
                }

                evaluatorIndex = (evaluatorIndex + 1) % totalEvaluators; // Garantir que o índice percorra todos os avaliadores
            }

            for (const evaluatorId of assignedEvaluators) {
                const review = new Review({
                    drawId: drawId,
                    evaluatorId: evaluatorId,
                    classified: false,
                    reviewDate: null,
                    reviewed: false,
                });
                await review.save();
                console.log(`Review criada para o desenho ${drawId} e avaliador ${evaluatorId}`);
            }
        }

        const cronExpression = `0 0 */${days_to_distribute} * *`;
        cron.schedule(cronExpression, async () => {
            const currentDate = new Date();
            if (currentDate <= new Date(end_date)) {
                await verifyEvaluate(notice.id);
            } else {
                console.log('A data final foi alcançada, não mais agendando a tarefa.');
            }
        });
    }

    catch (error) {
        console.error('Erro na distribuição dos desenhos:', error);
        const log = new Log({
            message: error,
            stack: "distributeDraws",
            date: new Date(),
            type: LOG_TYPES.ERROR,
          });
    }
}
