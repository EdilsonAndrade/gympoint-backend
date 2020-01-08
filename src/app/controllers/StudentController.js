import * as Yup from 'yup';
import { Op } from 'sequelize';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const { name } = req.query;

    if (!name || name.length < 0) {
      const students = await Student.findAll();

      return res.json(students);
    }

    const students = await Student.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });
    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      height: Yup.number()
        .required()
        .min(100),
      weight: Yup.number()
        .required()
        .min(45),
      age: Yup.number()
        .required()
        .min(20),
    });
    try {
      if (!(await schema.validate(req.body))) {
        return res.json({ error: 'Validation failed' });
      }
    } catch (error) {
      return res.json({ error: 'Validation failed' });
    }

    const { email } = req.body;
    const studentExist = await Student.findOne({ where: { email } });
    if (studentExist) {
      return res.status(400).json({ error: 'Student already exists' });
    }
    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      name: Yup.string(),
      age: Yup.number().min(20),
      weight: Yup.number().min(45),
      height: Yup.number().min(100),
    });

    try {
      if (!(await schema.validate(req.body))) {
        return res.status(400).json('Validation failed');
      }
    } catch (error) {
      return res.status(400).json(error.errors);
    }

    const { email, oldEmail } = req.body;
    let student = await Student.findOne({
      where: { email: oldEmail || email },
    });

    if (!student) {
      return res.status(404).json('Student not found');
    }

    if (oldEmail && oldEmail !== email) {
      const studentExist = await Student.findOne({ where: { email } });
      if (studentExist) {
        return res.status(400).json({ message: 'E-mail already exists' });
      }
    }
    student = await student.update(req.body);
    return res.json(student);
  }
}

export default new StudentController();
