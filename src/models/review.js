import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        id: { type: String },
        drawId: {type: mongoose.Schema.Types.ObjectId, ref: "draw", required: true},
        evaluatorId: {type: mongoose.Schema.Types.ObjectId, ref: "evaluator", required: false},
        numberOfAlerts: {type: Number, required: false, default: 0},
        score: {type: Number, required: false, default: 0},
        classified: {type: Boolean, required: true, default: false},
        note: {type: String, required: false},
        associatedDate: {type: Date, required: false},
        reviewDate: {type: Date, required: false},
        reviewd: {type: Boolean, default: false}
    },
    {
        versionKey: false
    }
)

const Review = mongoose.model("review", ReviewSchema);
export default Review;