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

    return res.json(registration);
  }
}

export default new RegistrationController();
