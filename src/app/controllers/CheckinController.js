import { Op } from 'sequelize';
import { addDays } from 'date-fns';
import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(401).json({ error: 'Student id is required' });
    }

    const checkinsDone = await Checkin.findAndCountAll({
      where: {
        student_id: studentId,
        createdAt: {
          [Op.between]: [addDays(new Date(), -6), new Date()],
        },
      },
    });

    if (checkinsDone.count >= 5) {
      return res
        .status(401)
        .json({ error: 'Student is not allowed to do checkin ' });
    }

    const checkin = await Checkin.create({
      student_id: studentId,
    });

    return res.json({ checkin, checkinsDone });
  }

  async index(req, res) {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(401).json({ error: 'Student id is required' });
    }

    const checkinsDone = await Checkin.findAndCountAll({
      where: {
        student_id: studentId,
      },
    });

    return res.json({ checkinsDone });
  }
}
export default new CheckinController();
