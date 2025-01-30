import mongoose from "mongoose";

const DrawSchema = new mongoose.Schema(
    {
        id: { type: String },
        title: { type: String, required: true },
        linkImage: { type: String, required: true },
        category: { type: String, required: true },
        score: {type: Number, required: false},
        reviewsId: [{type: mongoose.Schema.Types.ObjectId, ref: 'review'}],
        reviewFinished: {type: Boolean, required: false},
        classified: {type: String, required: false, default: "Pendente"},
        note: {type: String, required: false},
        author: {type: mongoose.Schema.Types.ObjectId, ref: "student", required: true},
        notice: {type: mongoose.Schema.Types.ObjectId, ref: "notices", required: true},
        doubleCheck: {type: Boolean, default: false}
    },
    {
        versionKey: false
    }
);

const Draw = mongoose.model("draw", DrawSchema);
export default Draw;