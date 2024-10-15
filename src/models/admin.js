import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
    {
        id: { type: String },
        cpf: {type: String},
        email: {type: String},
        name: {type: String},
        loginId: {type: mongoose.Schema.Types.ObjectId, ref: 'login'}
    },
    {
        versionKey: false
    }
);

const Admin = mongoose.model('admin', AdminSchema);
export default Admin;