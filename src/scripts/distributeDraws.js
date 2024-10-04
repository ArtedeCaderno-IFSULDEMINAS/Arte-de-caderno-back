import mongoose from 'mongoose';
import Draw from '../models/draw.js'; // Ajuste para o caminho correto do seu modelo
import Evaluator from '../models/evaluator.js'; // Ajuste para o caminho correto do seu modelo

async function distributeDraws() {
    try {
        // Obter todos os desenhos e avaliadores do banco de dados
        const draws = await Draw.find();
        const evaluators = await Evaluator.find();

        // Verifique se há avaliadores suficientes
        if (evaluators.length === 0) {
            console.log("Não há avaliadores disponíveis.");
            return;
        }

        // Distribuir os desenhos de forma aleatória
        for (const draw of draws) {
            // Obter dois avaliadores aleatórios
            const randomEvaluators = [];
            while (randomEvaluators.length < 2) {
                const randomIndex = Math.floor(Math.random() * evaluators.length);
                const evaluator = evaluators[randomIndex];
                if (!randomEvaluators.includes(evaluator._id)) {
                    randomEvaluators.push(evaluator._id);
                }
            }

            // Adicionar os avaliadores ao desenho
            draw.review = randomEvaluators.map(evaluatorId => ({
                evaluator: evaluatorId,
                numberOfAlertsEvaluator: 0, // ou outro valor inicial
                score: null,
                note: null,
                date: null,
                finished: false,
            }));

            // Salvar as alterações no desenho
            await draw.save();
        }

        console.log("Distribuição de desenhos concluída.");
    } catch (error) {
        console.error("Erro ao distribuir desenhos:", error);
    }
}

