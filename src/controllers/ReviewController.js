import Admin from "../models/admin.js";
import Draw from "../models/draw.js";
import Review from "../models/review.js";

class ReviewController {
    //usar a mesma rota para avaliar ou para desclassificar. 
    //caso desclassifique, mandar score como ZERO
    evaluateDraw = async (req, res, next) => {
        try{
            const {reviewId} = req.params;
            const {note, classified, score} =req.body;

            if(score < 0 || score > 100){
                return res.status(400).json({message: "Note is out of range"});
            }

            const updatedReview = await Review.findByIdAndUpdate(
                reviewId, 
                {
                    classified,
                    note, 
                    score, 
                    reviewDate: new Date(), 
                    reviewd: true
                },
                { new: true } 
            );

            if (!updatedReview) {
                return res.status(404).json({ message: "Review not found" });
            }

            if(!classified){
                const drawUpdated = await Draw.findByIdAndUpdate(
                    updatedReview.drawId,
                    {
                        classified: "Desclassificado",
                        note: note,
                    },
                    {new: true}
                );

                if(!drawUpdated){
                    return res.status(400).json({message: "Cannot possible desclassified draw."})
                } 
            }


            return res.status(200).json(updatedReview);

        }
        catch (err) {
            next(err);
        }
    }

    listReviews = async (req, res, next) => {
        try{
            const reviews = await Review.find();

            if(!reviews || reviews.length === 0){
                return res.status(404).json({message: "Cannot find reviews."})
            }

            return res.status(200).json(reviews);
        }

        catch(err){
            next(err);
        }
    }

    findDrawReviews = async (req, res, next) => {
        try{
            const {drawId} = req.params;

            const reviews = await Review.find({drawId: drawId});
    
            if (!reviews || reviews.length === 0) {  
                return res.status(404).json({ message: `There are no reviews with drawId: ${drawId}` });
            }

            return res.status(200).json(reviews)
        }

        catch (err){
            next(err);
        }
    }

    findEvaluatorReviews = async (req, res, next) => {
        try{
            const {evaluatorId} = req.params;

            const reviews = await Review.find({evaluatorId: evaluatorId});
    
            if (!reviews || reviews.length === 0) {  
                return res.status(404).json({ message: `There are no reviews with evaluatorId: ${evaluatorId}` });
            }

            return res.status(200).json(reviews)
        }

        catch (err){
            next(err);
        }
    }
}

export default new ReviewController();