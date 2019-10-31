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

    const existPlan = await Plan.findOne({
      where: { duration, price },
    });
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

  async index(req, res) {
    const plans = await Plan.findAll();
    return res.json(plans);
  }

  async delete(req, res) {
    const id = req.params.planId;

    const existPlan = await Plan.findByPk(id);
    if (!existPlan) {
      return res.status(404).json('Plan selected to delete does not exist');
    }
    await existPlan.destroy();

    return res.json();
  }

  async update(req, res) {
    const id = req.params.planId;
    if (!id) {
      return res.status(401).json('Plan id must be informed');
    }
    const schema = Yup.object().shape({
      title: Yup.string().min(3),
      duration: Yup.number().min(1),
      price: Yup.number().min(50),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json(401).json('Validation failed');
    }

    const existPlan = await Plan.findByPk(id);
    if (!existPlan) {
      return res.status(404).json('Plan selected to delete does not exist');
    }

    const { title, duration, price, description } = req.body;

    if (title || duration || price || description) {
      const plan = await existPlan.update({
        title,
        duration,
        price,
        description,
      });

      return res.json(plan);
    }
    return res.json('No changes were made');
  }
}
export default new PlanController();
