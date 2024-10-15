import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema(
    {
        id: { type: String },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String }, //teste
        code2factor: {type: String}, //, default: 'hduahfua'
        createdAt: { type: Date, default: Date.now },
        tokenForgotPassword: { type: String, select: false },
        passwordResetExpires: { type: Date, select: false },
        accessType: { type: String},
        firstAccess: {type: Boolean, default: false}
    },
    {
        versionKey: false
    }
);

const Login = mongoose.model("logins", LoginSchema);
export default Login;