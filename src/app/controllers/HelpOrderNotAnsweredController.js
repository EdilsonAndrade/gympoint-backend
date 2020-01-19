import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import QuestionJob from '../jobs/QuestionAnsweredMail';
import Queue from '../../lib/Queue';

class HelpOrderNotAnsweredController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer: null,
      },
      include: [
        {
          model: Student,
          attributes: ['email', 'name'],
        },
      ],
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const { helpOrderId } = req.params;
    const { answer } = req.body;
    if (!helpOrderId) {
      return res.status(400).json({ error: 'Help order Id is required' });
    }

    const schema = Yup.object().shape({
      answer: Yup.string()
        .required()
        .min(10),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Help order answer must have at least 10 words lenthg',
      });
    }

    const helpOrder = await HelpOrder.findByPk(helpOrderId, {
      include: [
        {
          model: Student,
          attributes: ['email', 'name'],
        },
      ],
    });
    if (!helpOrder) {
      return res.status(404).json({
        error: 'Help order not found',
      });
    }

    helpOrder.update({
      answer,
      answerAt: new Date(),
    });

    Queue.add(QuestionJob.key, {
      questionAnswered: {
        studentName: helpOrder.Student.name,
        email: helpOrder.Student.email,
        question: helpOrder.question,
        answer: helpOrder.answer,
        answerAt: helpOrder.answerAt,
      },
    });
    return res.json(helpOrder);
  }
}
export default new HelpOrderNotAnsweredController();
