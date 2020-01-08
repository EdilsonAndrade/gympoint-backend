import Sequelize, { Model } from 'sequelize';
import { isBefore, isAfter } from 'date-fns';

class Registration extends Model {
  static init(connection) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL(10, 2),
        active: {
          type: Sequelize.VIRTUAL(Sequelize.BOOLEAN, [
            'start_date',
            'end_date',
          ]),
          get() {
            return (
              isBefore(this.get('start_date'), new Date()) &&
              isAfter(this.get('end_date'), new Date())
            );
          },
        },
      },
      {
        sequelize: connection,
      }
    );
    return this;
  }

  static associate(model) {
    this.belongsTo(model.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(model.Plan, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Registration;
