import mongoose from "mongoose";

const EvaluatorSchema = new mongoose.Schema(
    {
        id: {type: String},
        name: {type: String, required: true},
        email: {type: String, required: true},
        cpf: {type: String, required: true},
        start_date: { type: String},
        final_date: { type: String},
        draws: [{type: mongoose.Schema.Types.ObjectId, ref: 'draw'}],
        reviewsId: [{type: mongoose.Schema.Types.ObjectId, ref: 'review'}],
        loginId: {type: mongoose.Schema.Types.ObjectId, ref: 'login'},
    },
    {
        versionKey: false
    }
)

const Evaluator = mongoose.model('evaluator', EvaluatorSchema);
export default Evaluator;