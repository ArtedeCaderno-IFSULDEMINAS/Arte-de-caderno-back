import Login from "../models/login.js";




class AdminController{
    listAdmin = async(req,res,next) => {
        try{
            const admins = await Login.find({ accessType: 'admin' });
            res.status(200).json(admins);
        }
        catch(err){
            next(err);
        }
    }



    getAdminById = async(req, res, next) => {
        try{
            const {id} =req.params;
            const admin = await Login.findById(id);

            if(admin === null){
                return res.status(404).json({message: 'Admin not found'});
            }

            const response = {
                admin: admin,
                accessType: 'admin'
            };

            res.status(200).json(response);
        }
        catch(err){
            next(err);
        }
    }
}

export default new AdminController;