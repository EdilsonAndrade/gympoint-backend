import Sequelize, { Model } from 'sequelize';

class Registration extends Model {
  static init(connection) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL(10, 2),
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
