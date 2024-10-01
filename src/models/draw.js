import mongoose from "mongoose";

const DrawSchema = new mongoose.Schema(
    {
        id: { type: String },
        title: { type: String, required: true },
        linkImage: { type: String, required: true },
        category: { type: String, required: true },
        score: {type: Number, required: false},
        review:[{
            evaluator: {type: mongoose.Schema.Types.ObjectId, ref: "evaluator", required: false},
            numberOfAlertsEvaluator: {type: Number, required: false, default: 0},
            score: {type: Number, required: false},
            note: {type: String, required: false},
            date: {type: Date, required: false},
            finished: {type: Boolean, required: false}
        }],
        reviewFinished: {type: Boolean, required: false},
        classified: {type: Boolean, required: false},
        note: {type: String, required: false},
        author: {type: mongoose.Schema.Types.ObjectId, ref: "student", required: true},
        novice: {type: String, required: true}
    },
    {
        versionKey: false
    }
);

const Draw = mongoose.model("draw", DrawSchema);
export default Draw;