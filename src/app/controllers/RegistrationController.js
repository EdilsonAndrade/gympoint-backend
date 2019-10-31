import { parseISO, addMonths } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

class RegistrationController {
  async store(req, res) {
    const { studentId, planId } = req.params;
    const { start_date } = req.body;

    const existStudent = await Student.findByPk(studentId);

    if (!existStudent) {
      return res.status(404).json('Student not found');
    }

    const existPlan = await Plan.findByPk(planId);
    if (!existPlan) {
      return res.status(404).json('Plan not found');
    }

    if (!start_date) {
      return res.status(404).json('Start date is mandatory');
    }

    const { duration } = existPlan;
    const end_date = addMonths(parseISO(start_date), duration);
    const price = existPlan.duration * existPlan.price;

    const registration = await Registration.create({
      end_date,
      start_date,
      student_id: studentId,
      plan_id: planId,
      price,
    });
    // TODO send email welcome to the user
    return res.json(registration);
  }

  async index(req, res) {
    const { id } = req.query;
    let registrations = {};
    if (!id) {
      registrations = await Registration.findAll();
    } else {
      registrations = await Registration.findByPk(id);
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

    return res.json({ message: 'Registration deleted' });
  }
}

export default new RegistrationController();
