import { addMonths } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../lib/Queue';
import WelcomeMail from '../jobs/WelcomeMail';
import ChangeRegistrationMail from '../jobs/ChangeRegistrationMail';

class RegistrationController {
  async store(req, res) {
    const { studentId, planId } = req.params;

    const start_date = new Date(req.body.startDate);
    const existStudent = await Student.findByPk(studentId);

    if (!existStudent) {
      return res.status(404).json('Student not found');
    }

    const existPlan = await Plan.findByPk(planId);
    if (!existPlan) {
      return res.status(404).json('Plan not found');
    }

    const { duration } = existPlan;
    const end_date = addMonths(start_date, duration);
    const price = existPlan.duration * existPlan.price;

    const registration = await Registration.create({
      end_date,
      start_date,
      student_id: studentId,
      plan_id: planId,
      price,
    });

    Queue.add(WelcomeMail.key, {
      registration: {
        endDate: end_date,
        studentName: existStudent.name,
        email: existStudent.email,
        plan: existPlan.title,
        duration,
        price,
      },
    });
    return res.json(registration);
  }

  async index(req, res) {
    const { id } = req.query;
    let registrations = {};
    if (!id) {
      registrations = await Registration.findAll({
        include: [
          {
            model: Plan,
            as: 'plan',
            attributes: ['id', 'title', 'duration', 'description', 'price'],
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
    } else {
      registrations = await Registration.findByPk(id, {
        include: [
          {
            model: Plan,
            as: 'plan',
            attributes: ['title', 'duration', 'description', 'price'],
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
    }

    return res.json(registrations);
  }

  async delete(req, res) {
    const id = req.params.registrationId;

    if (!id) {
      return res.status(400).json({ error: 'Registration id is missed' });
    }

    const registration = await Registration.findByPk(id);

    if (registration) {
      await registration.destroy();
    }

    const registrations = await Registration.findAll({
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'description', 'price'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    return res.json(registrations);
  }

  async update(req, res) {
    const id = req.params.registrationId;
    const { studentId, planId, startDate } = req.body;
    if (!id) {
      return res.status(401).json({ error: 'Registration id is mandatory' });
    }

    const registration = await Registration.findByPk(id);

    if (studentId || planId) {
      const start_date = new Date(startDate);
      const existStudent = await Student.findByPk(studentId);

      if (!existStudent) {
        return res.status(404).json('Student not found');
      }

      const existPlan = await Plan.findByPk(planId);
      if (!existPlan) {
        return res.status(404).json('Plan not found');
      }

      const { duration } = existPlan;
      const end_date = addMonths(start_date, duration);
      const price = existPlan.duration * existPlan.price;
      await registration.update({
        end_date,
        start_date,
        student_id: studentId,
        plan_id: planId,
        price,
      });
      Queue.add(ChangeRegistrationMail.key, {
        registration: {
          endDate: end_date,
          studentName: existStudent.name,
          email: existStudent.email,
          plan: existPlan.title,
          duration,
          price,
        },
      });
    }
    return res.json(registration);
  }
}

export default new RegistrationController();
