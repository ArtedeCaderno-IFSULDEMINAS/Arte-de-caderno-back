import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
    {
        id: {type: String},
        active: {type: Boolean, default: false},
        create_date: {type: Date, required: true},
        start_submit_date: { type: Date, required: true },
        end_submit_date: { type: Date, required: true },
        start_evaluate_date: {type: Date, required: true},
        end_evaluate_date: {type: Date, required: true},
        notice_file: { type: String, required: true },
        draws: [{type: mongoose.Schema.Types.ObjectId, ref: 'draw'}]
    }
)

const Notice = mongoose.model('notice', NoticeSchema);
export default Notice;