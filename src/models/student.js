import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
    {
        id: { type: String },
        name: { type: String, required: true },
        date_of_birth: { type: Date, required: true },
        cpf: { type: String, required: true, unique: true },
        phone: { type: String},
        cep: { type: String},
        address: { type: String},
        city: { type: String},
        uf: { type: String},
        email: { type: String},
        schoolId: {type: mongoose.Schema.Types.ObjectId, ref: 'school', required: true},
        drawsId: [{type: mongoose.Schema.Types.ObjectId, ref: 'draw'}],
        loginId: {type: mongoose.Schema.Types.ObjectId, ref: 'login'},
        shirtSize: {type: String, required: true},
        createdAt: { type: Date, default: Date.now() },
    },
    {
        versionKey: false
    }
);
const Student = mongoose.model("student", StudentSchema);
export default Student;