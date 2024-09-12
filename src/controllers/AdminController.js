import Login from "../models/login.js";
import createHashWithSalt from "../middleware/hashWithSalt.js";
import Admin from "../models/admin.js";
import { ERROR_MESSAGE } from "../constants/Messages.js";

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

    createAdmin = async(req, res, next) => {
        try{
            const 
            {
                username, 
                password,
                email
            } = req.body;

        if(!username|| !password|| !email){
            return res.status(400).json({ message: ERROR_MESSAGE.ALL_FIELDS_REQUIRED});
        }

        const loginExists = await Login.findOne({username: username})

        if (loginExists !== null) {
            return res
              .status(400)
              .json({ message: ERROR_MESSAGE.USER_ALREADY_EXISTS });
          }
        
          const hashPassword = await createHashWithSalt(password);
          const login = new Login({
            username: username,
            password: hashPassword,
            accessType: "admin",
            email: email,
          });

          const newLogin = await login.save();

          if(newLogin == null){
           return res.status(400).json({ message: ERROR_MESSAGE.SAVE_DOCUMENT_ERROR});
          }

          const admin = new Admin({
            username: username,
            email: email,
            loginId: newLogin._id
          });

          const newAdmin = await admin.save();
            res.status(201).json(newAdmin); 

        }
        
        catch (err) {
            res.status(400).json({ message: err.message });
          }
    }
}

export default new AdminController;