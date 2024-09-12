import Login from "../models/login.js";
import Student from "../models/student.js";
import createHashWithSalt from "../middleware/hashWithSalt.js";
import Draw from "../models/draw.js";
import { ERROR_MESSAGE } from "../constants/Messages.js";

class StudentController {
  listStudent = async (req, res, next) => {
    try {
      const students = await Student.find();
      res.status(200).json(students);
    } catch (err) {
      next(err);
    }
  };

  getStudentById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const student = await Student.findById(id);

      if (student === null) {
        return res
          .status(404)
          .json({ message: ERROR_MESSAGE.STUDENT_NOT_FOUND });
      }
      const response = {
        user: student,
        accessType: "student",
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  insertStudent = async (req, res, next) => {
    const {
      name,
      date_of_birth,
      cpf,
      phone,
      cep,
      address,
      city,
      uf,
      email,
      schoolId,
      password,
    } = req.body;

    if(!name || !date_of_birth || !cpf || !phone || !address || !city || !uf || !email || !schoolId || !password){
      return res
        .status(400)
        .json({message: ERROR_MESSAGE.ALL_FIELDS_REQUIRED})
    }


    const loginExists = await Login.findOne({ username: cpf });

    if (loginExists !== null) {
      return res
        .status(400)
        .json({ message: ERROR_MESSAGE.USER_ALREADY_EXISTS });
    }

    const hashPassword = await createHashWithSalt(password);
    const login = new Login({
      username: cpf,
      password: hashPassword,
      accessType: "student",
      email: email,
    });

    try {
      const newLogin = await login.save();
      const student = new Student({
        name: name,
        date_of_birth: date_of_birth,
        cpf: cpf,
        phone: phone,
        cep: cep,
        address: address,
        city: city,
        uf: uf,
        loginId: newLogin._id,
        email: email,
        schoolId: schoolId,
      });
      const newStudent = await student.save();
      res.status(201).json(newStudent);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  updateStudent = async (req, res, next) => {
    const { id } = req.params;
    const update = req.body;

    try {
      const studentUpdate = await Student.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true }
      );

      if (studentUpdate === null) {
        return res
          .status(404)
          .json({ message: ERROR_MESSAGE.STUDENT_NOT_FOUND });
      }

      return res.status(200).json(studentUpdate);
    } catch (err) {
      next(err);
    }
  };

  deleteStudent = async (req, res, next) => {
    const { id } = req.params;

    try {
      const student = await Student.findById(id);
      if (student === null) {
        return res
          .status(400)
          .json({ message: ERROR_MESSAGE.STUDENT_NOT_FOUND });
      }

      await Login.deleteOne({ _id: student.loginId });

      const result = await Student.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        return res
          .status(400)
          .json({ message: ERROR_MESSAGE.STUDENT_NOT_FOUND });
      }
      res.status(200).json({ message: ERROR_MESSAGE.DELETED });
    } catch (err) {
      next(err);
    }
  };

  getDrawsByStudent = async (req, res, next) => {
    const { id } = req.params;
    try {
      const student = await Student.findById(id);
      if (student === null) {
        return res
          .status(404)
          .json({ message: ERROR_MESSAGE.STUDENT_NOT_FOUND });
      }
      const draws = await Draw.find({ author: id });
      res.status(200).json(draws);
    } catch (err) {
      next(err);
    }
  };
}

export default new StudentController();
