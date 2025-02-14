import Enrollment from "../models/enrollment.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

class EnrollmentController{
    insertAcceptEnrollment = async(req, res, next) => {
        try{
            const { studentId } = req.body;
            const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
            const signedTermUrl = req.file ? `/uploads/${req.file.filename}` : null;

            const updatedEnrollment = await Enrollment.findOneAndUpdate(
                { studentIdId: studentId },
                { 
                    termsAccepted: true, 
                    acceptanceDate: new Date(), 
                    acceptanceIp: ip,
                    ...(signedTermUrl && { signedTermUrl })
                },
                { new: true, upsert: true }
            );

            res.status(200).json({ message: "Terms accepted successfully", enrollment: updatedEnrollment });
        }

        catch(err){
            next(err);
        }
    }

    listAllEnrollment = async(req, res, next) => {
        try{
            const enrollments = await Enrollment.find();

            if(!enrollments){
                return res.status(404).json({ message: "Enrollment not found" });
            }
    
            res.status(200).json(enrollments);
        }
        catch(err){
            next(err);
        }
    }

    findEnrollmentByUserId = async (req, res, next) =>{
        try{
            const {userId} = req.params;

            const enrollment = await Enrollment.findOne({userId: userId});

            if (!enrollment) {
                return res.status(404).json({ message: "Enrollment not found" });
              }
            
            res.status(200).json(enrollment);
        }
        catch(err){
            next(err);
        }
    }
}

export const uploadMiddleware = upload.single("signedTerm");
export default new EnrollmentController;