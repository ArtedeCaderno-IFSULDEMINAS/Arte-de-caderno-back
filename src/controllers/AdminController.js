import Login from "../models/login.js";
import createHashWithSalt from "../middleware/hashWithSalt.js";
import Admin from "../models/admin.js";
import { ERROR_MESSAGE } from "../constants/Messages.js";
import transporter from '../middleware/emailConfig.js';
import crypto from 'crypto';

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
            const admin = await Admin.findById(id);

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
                cpf,
                email,
                name
            } = req.body;

            if(!cpf|| !name|| !email){
                return res.status(400).json({ message: ERROR_MESSAGE.ALL_FIELDS_REQUIRED});
            }

            const loginExists = await Login.findOne({cpf: cpf})

            if (loginExists !== null) {
                return res
                .status(400)
                .json({ message: ERROR_MESSAGE.USER_ALREADY_EXISTS });
            }
        
          const randomPassword = this.generateRandomPassword(8);
          const hashPassword = await createHashWithSalt(randomPassword);

          const login = new Login({
            username: cpf,
            password: hashPassword,
            accessType: "admin",
            email: email,
            firstAccess: true
          });

          const newLogin = await login.save();

          async function sendEmail() {
            const mailSent = await transporter.sendMail({
                subject: 'Senha para primeiro acesso',
                from: 'Equipe Arte de Caderno <artedecaderno.if@gmail.com>',
                to: email,
                html: `<p>Sua senha inicial para acessar a plataforma é:</p>
                <p style="color: DarkMagenta; font-size: 25px; letter-spacing: 2px;">
                  <b>${randomPassword}</b>
                </p>
                <p><b>Ao fazer o primeiro acesso, você deve alterar a senha.</b>.</p>`

            })};

            sendEmail();

          if(newLogin == null){
           return res.status(400).json({ message: ERROR_MESSAGE.SAVE_DOCUMENT_ERROR});
          }

          const admin = new Admin({
            cpf: cpf,
            email: email,
            name: name,
            loginId: newLogin._id,
            drawsDoubleCheck: [],
            reviews: []
          });

          const newAdmin = await admin.save();
            res.status(201).json(newAdmin); 

        }
        
        catch (err) {
            res.status(400).json({ message: err.message });
          }
    }

    generateRandomPassword(length) {
        return crypto
          .randomBytes(length)
          .toString('base64')  
          .slice(0, length)    
          .replace(/[+/]/g, ''); 
      }
}

export default new AdminController;