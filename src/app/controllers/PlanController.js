import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string()
        .required()
        .min(3),
      duration: Yup.number()
        .required()
        .min(1),
      price: Yup.number()
        .required()
        .min(50),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json('Validation Failed');
    }

    const { duration, title, price, description } = req.body;

    const existPlan = await Plan.findAll({ where: { duration, price } });
    if (existPlan) {
      return res
        .status(401)
        .json(
          `Plan with the duration ${duration} and price: ${price} already exist`
        );
    }
    const plan = await Plan.create({ duration, title, price, description });

    return res.json(plan);
  }
}
export default new PlanController();
