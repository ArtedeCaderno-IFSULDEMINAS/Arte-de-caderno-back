import mongoose from 'mongoose'

const EnrollmentSchema = new mongoose.Schema({
    id: {type: String},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "Login", required: true},
    termsAccepted: { type: Boolean, default: false },
    acceptanceDate: { type: Date },
    acceptanceIp: { type: String }
});

const Enrollment = mongoose.model("enrollment", EnrollmentSchema);

export default Enrollment;