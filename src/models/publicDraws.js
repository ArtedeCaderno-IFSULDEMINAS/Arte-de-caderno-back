import mongoose from "mongoose";

const PublicDrawsSchema = new mongoose.Schema(
    {
        id: {type: String},
        draws: [{type: mongoose.Schema.Types.ObjectId, ref: 'draw'}],  
    },
    {
        versionKey: false
    }
)

const PublicDraws = mongoose.model('publicDraws', PublicDrawsSchema);
export default PublicDraws;