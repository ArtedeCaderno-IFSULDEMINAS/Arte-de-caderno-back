import { ERROR_MESSAGE } from "../constants/Messages.js";
import School from "../models/school.js";

class SchoolController {
    
        listSchool = async (req, res, next) => {
            try{
                const schools = await School.find();
                res.status(200).json(schools);
            }
            catch(err){
                next(err);
            }
        }

        getSchoolById = async (req, res, next) => {
            try{
                const {id} = req.params;
                const school = await School.findById(id);
                
                if(school === null){
                    return res.status(404).json({message: ERROR_MESSAGE.SCHOOL_NOT_FOUND});
                }
    
                res.status(200).json(school);
            }
            catch(err){
                next(err);
            }
        }
    
        insertSchool = async (req, res, next) => {
            const {name, code, uf, city, address, cep, phone, email, site} = req.body;
            if(name === null || code === null || uf === null || city === null || address === null || cep === null || phone === null){
                return res.status(400).json({message: 'All fields are required'});
            }

            const school = new School({
                name: name,
                code: code,
                uf: uf,
                city: city,
                address: address,
                cep: cep,
                phone: phone,
                email: email,
                site: site
            });
            try{
                const existSchool = await School.find({code: code})

                if(existSchool.length !== 0){
                    return res.status(400).json({message: "School Already Exists"})
                }
                
                const newSchool = await school.save();
                res.status(200).json(newSchool);
            }
            catch(err){
                next(err);
            }
        }

        listSchoolByCity = async (req, res, next) => {
            const {city} = req.body;
            if(city === null){
                return res.status(400).json({message: ERROR_MESSAGE.ALL_FIELDS_REQUIRED});
            }
            try{
                const schools = await School.find({city: city});
                res.status(200).json(schools);
            }
            catch(err){
                next(err);
            }
        }

        listUfs = async (req, res, next) => {
            try{
                const ufs = await School.find().distinct('uf');
                res.status(200).json(ufs);
            }
            catch(err){
                next(err);
            }
        }

        listCitiesByUf = async (req, res, next) => {
            const {uf} = req.body;
            if(uf === null){
                return res.status(400).json({message: ERROR_MESSAGE.ALL_FIELDS_REQUIRED});
            }
            if(uf.length !== 2){
                return res.status(400).json({message: ERROR_MESSAGE.BAD_REQUEST});
            }
            try{
                const cities = await School.find({uf: uf}).distinct('city');
                res.status(200).json(cities);
            }
            catch(err){
                next(err);
            }
        }

        


}
export default new SchoolController;