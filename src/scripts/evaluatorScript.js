import transporter from "../middleware/emailConfig.js";
import Draw from "../models/draw.js";
import Evaluator from "../models/evaluator.js";
import cron from 'node-cron';

async function verifyEvaluator() {
    const draws = await Draw.find({ reviewFinished: false });
    draws.map(
        (draw) =>
            async function () {
                draw.review.map(
                    (review) =>
                        async function () {
                            if (review.finished === false) {
                                const evaluator = await Evaluator.findById(review.evaluator);
                                if (review.numberOfAlertsEvaluator === 3) {
                                    changeEvaluator(evaluator, draw);
                                } else {
                                    await sendEmailToEvaluator(evaluator);
                                }
                            }
                        }
                );
            }
    );
}

async function sendEmailToEvaluator(evaluator) {
    try {
        await sendEmail(evaluator.email);
    } catch (err) {
        console.log(err);
    }
}

async function changeEvaluator(evaluator, draw) {
    //pega um avaliador aleatorio do banco que não tenha avaliado esse desenho
    const newEvaluator = await Evaluator.findOne({ draws: { $nin: draw._id } });
    //remove o avaliador atual do desenho
    await Draw.findOneAndUpdate(draw._id, {
        $pull: { review: { evaluator: evaluator._id } },
    });
    //remove o desenho da lista de desenhos do avaliador atual
    await Evaluator.findOneAndUpdate(evaluator._id, {
        $pull: { draws: draw._id },
    });
    //adiciona o novo avaliador no desenho
    await Draw.findOneAndUpdate(draw._id, {
        $push: { review: { evaluator: newEvaluator._id } },
    });
    //adiciona o desenho na lista de desenhos do novo avaliador
    await Evaluator.findOneAndUpdate(newEvaluator._id, {
        $push: { draws: draw._id },
    });
}

async function sendEmail(email) {
    await transporter.sendMail({
        subject: "Lembrete de Avaliação",
        from: "Equipe Arte de Caderno <artedecaderno.if@gmail.com>",
        to: email,
        html: `<p>Lembrete:</p>
        <p style="color: DarkMagenta; font-size: 25px; letter-spacing: 2px;">
            Você tem avaliações pendentes!
        </p>
        <p>Acesse o portal para realizá-las</p>`,
    });
}

const task = verifyEvaluator()

export default task;
