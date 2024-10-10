import Professor from "../models/professor.js";
import Login from "../models/login.js";
import School from "../models/school.js";
import Student from "../models/student.js";
import createHashWithSalt from "../middleware/hashWithSalt.js";
import { ERROR_MESSAGE } from "../constants/Messages.js";

class ProfessorController {

    listProfessor = async (req, res, next) => {
        try{
            const professors = await Professor.find();
            res.status(200).json(professors);
        }
        catch(err){
            next(err);
        }
    }

    getProfessorById = async (req, res, next) => {
        try{
            const {id} = req.params;
            const professor = await Professor.findById(id);

            if(professor === null){
                return res.status(404).json({message: ERROR_MESSAGE.PROFESSOR_NOT_FOUND});
            }
            
            const response = {
                user: professor,
                accessType: 'professor'
            };

            res.status(200).json(response);
        }
        catch(err){
            next(err);
        }
    }

    insertProfessor = async (req, res, next) => {
        const {name, date_of_birth, cpf, phone, cep, address, city, uf, email, schoolId, password} = req.body;
        const loginExists = await Login.findOne({username: cpf});
        if(loginExists !== null){
            return res.status(400).json({message: ERROR_MESSAGE.USER_ALREADY_EXISTS});
        }
        
        const hashPassword = await createHashWithSalt(password);
        const login = new Login({
            username: cpf,
            password: hashPassword,
            accessType: 'professor',
            email: email
        });
        try{
            const newLogin = await login.save();
            const professor = new Professor({
                name: name,
                date_of_birth: date_of_birth,
                cpf: cpf,
                phone: phone,
                cep: cep,
                address: address,
                city: city,
                uf: uf,
                loginId: newLogin._id,
                schoolId: schoolId,
                email: email
            });
            const newProfessor = await professor.save();
            res.status(201).json(newProfessor);
        }
        catch(err){
            next(err);
        }

    }

    updateProfessor = async (req, res, next) => {
        const {id} = req.params;
        const update = req.body;
        try{
            const professorUpdate = await Professor.findByIdAndUpdate(
                id,
                {$set: update},
                {new: true}
            );
    
            if(professorUpdate === null){
                return res.status(404).json({message: ERROR_MESSAGE.PROFESSOR_NOT_FOUND});
            }
    
            return res.status(200).json(professorUpdate);
        }

        catch(err){
            next(err);
        }
    }

    deleteProfessor = async (req, res, next) => {
        const {id} = req.params;
        try{
            const professor = await Professor.findById(id);
            if(professor === null){
                return res.status(400).json({message: ERROR_MESSAGE.PROFESSOR_NOT_FOUND});
            }
            await Login.deleteOne({_id: professor.loginId});
            const result = await Professor.deleteOne({_id: id});

            if(result.deletedCount === 0){
                return res.status(400).json({message: ERROR_MESSAGE.PROFESSOR_NOT_FOUND});
            }
            return res.status(200).json({message: ERROR_MESSAGE.DELETED});
        }
        catch(err){
            next(err);
        }
    }

    listSchoolByProfessorId = async (req, res, next) => {
        const schools = [];
        const {id} = req.params;
        try{
            const professor = await Professor.findById(id);
            if(professor === null){
                return res.status(404).json({message: ERROR_MESSAGE.PROFESSOR_NOT_FOUND});
            }
            for(let i = 0; i < professor.schoolId.length; i++){
                const school = await School.findById(professor.schoolId[i]);
                schools.push(school);
            }
            return res.status(200).json(schools);
        }
        catch(err){
            next(err);
        }
    }

    insertStudentByProfessorId = async (req, res, next) => {
        const {id} = req.params;
        try{
            const {name, date_of_birth, cpf, schoolId, cep, address, city, uf} = req.body;

            if(!name || !date_of_birth || !cpf || !schoolId){
                return res.status(400).json({message: ERROR_MESSAGE.ALL_FIELDS_REQUIRED});
            }
            const studentExists = await Student.findOne({cpf: cpf});
            const professor = await Professor.findById(id);

            if(professor === null){
                return res.status(404).json({message: ERROR_MESSAGE.PROFESSOR_NOT_FOUND});
            }

            if(studentExists !== null){
                return res.status(400).json({message: ERROR_MESSAGE.USER_ALREADY_EXISTS});
            }
            
            const newStudent = new Student({
                address : address,
                cep : cep,
                city : city,
                cpf : cpf,
                date_of_birth : date_of_birth,
                name: name,
                uf: uf,
                schoolId: schoolId
            }
            )
            await newStudent.save();
    
            professor.studentsId.push(newStudent._id);

            await professor.save();
    
            return res.status(201).json(newStudent);
        }

        catch(err){
            next(err);
        }
        
    }

    listStudentsByProfessorId = async (req, res, next) => {
        const {id} = req.params;

        try{
            const professor = await Professor.findById(id);
            if(professor === null){
                return res.status(404).json({message: ERROR_MESSAGE.PROFESSOR_NOT_FOUND});
            }
            const students = [];
            for(let i = 0; i < professor.studentsId.length; i++){
                const student = await Student.findById(professor.studentsId[i]);
                students.push(student);
            }
            return res.status(200).json(students);
        }
        catch(err){
            next(err);
        }
    }

    addSchoolByProfessorId = async (req, res, next) => {
        const {id} = req.params;
        const {schoolId} = req.body;
        if(schoolId === null){
            return res.status(400).json({message: ERROR_MESSAGE.ALL_FIELDS_REQUIRED});
        }
        try{
            const professor = await Professor.findById(id);
            if(professor === null){
                return res.status(400).json({message: ERROR_MESSAGE.PROFESSOR_NOT_FOUND});
            }
            professor.schoolId.push(schoolId);
            await professor.save();
            return res.status(200).json(professor);
        }
        catch(err){
            next(err);
        }
    }

    // getInfoByProfessorId = async (req, res, next) => {
    //     const {id} = req.params;

    //     try{
    //         const professor = await Professor.findById(id);

    //         if(professor === null){
    //             return res.status(400).json({message: ERROR_MESSAGE.PROFESSOR_NOT_FOUND});
    //         }
            
    //     }
    // }
}

export default new ProfessorController;