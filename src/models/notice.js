import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
    {
        id: {type: String, required: true},
        start_date: { type: String, required: true },
        final_date: { type: String, required: true },
        notice_file: { type: String, required: true },
        draws: [{type: mongoose.Schema.Types.ObjectId, ref: 'draw'}]
    
    }
)

const Notice = mongoose.model('notice', NoticeSchema);
export default Notice;