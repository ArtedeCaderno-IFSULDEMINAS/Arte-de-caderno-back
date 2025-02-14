import mongoose from 'mongoose'

const EnrollmentSchema = new mongoose.Schema({
    id: {type: String},
    studentId: {type: mongoose.Schema.Types.ObjectId, ref: "student", required: true},
    termsAccepted: { type: Boolean, default: false },
    acceptanceDate: { type: Date },
    acceptanceIp: { type: String },
    signedTermUrl: { type: String }
});

const Enrollment = mongoose.model("enrollment", EnrollmentSchema);

export default Enrollment;