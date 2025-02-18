import Review from "../models/review.js";
import Draw from "../models/draw.js"
import Log from "../models/log.js";

export default async function verifyEvaluate(noticeId){
    const draws = await Draw.find({notice: noticeId});

    try{
        for(const draw of draws){
            const reviews = await Review.find({drawId: draw.id})
            if (!reviews.length) return;
    
            if (reviews.some(review => !review.classified)) {
                await VerifyDrawDesclassified(draw.id);
                return;
            }
    
            if (reviews.every(review => review.reviewd)) {
                const averageScore = reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length;
                await Draw.findByIdAndUpdate(draw.id, {
                    reviewFinished: true,
                    score: averageScore,
                    classified: "Classificado"
                });
            }
    
            for (const review of reviews) {
                if (!review.evaluatorId) {
                    const availableEvaluator = await Evaluator.findOne({ reviewsId: { $ne: review._id } });
                    if (availableEvaluator) {
                        review.evaluatorId = availableEvaluator._id;
                        await review.save();
                    }
                }
            }
        }
    }
    catch(err){
        console.error('Erro ao verificar avaliações:', err);
        const log = new Log({
            message: err,
            stack: "verifyEvaluate",
            date: new Date(),
            type: LOG_TYPES.ERROR,
          });
    }
}

async function VerifyDrawDesclassified(drawId) {
    await Draw.findByIdAndUpdate(drawId, { classified: "Desclassificado" });
}