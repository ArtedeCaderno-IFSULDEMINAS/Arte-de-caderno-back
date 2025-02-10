import Enrollment from "../models/enrollment.js";

class EnrollmentController{
    insertAcceptEnrollment = async(req, res, next) => {
        try{
            const { userId } = req.body;
            const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

            await Enrollment.findOneAndUpdate(
                { userId: userId },
                { termsAccepted: true, acceptanceDate: new Date(), acceptanceIp: ip },
                { new: true, upsert: true }
              );

              res.status(200).json({ message: "Terms accepted successfully" });
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

export default new EnrollmentController;