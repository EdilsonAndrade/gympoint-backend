import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async index(req, res) {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(401).json({ error: 'Student id is required' });
    }
    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id: studentId,
      },
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const { studentId } = req.params;
    const { question } = req.body;

    const schema = Yup.object().shape({
      question: Yup.string()
        .required()
        .min(10),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(401)
        .json({ error: 'Question is required with at least 10 words' });
    }
    if (!studentId) {
      return res.status(401).json({ error: 'Student id is required' });
    }

    const helpOrders = await HelpOrder.create({
      question,
      student_id: studentId,
    });

    return res.json(helpOrders);
  }
}
export default new HelpOrderController();
