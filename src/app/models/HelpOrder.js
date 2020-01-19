import Sequelize, { Model } from 'sequelize';

class HelpOrders extends Model {
  static init(connection) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answerAt: Sequelize.DATE,
      },
      {
        sequelize: connection,
      }
    );
    return this;
  }

  static associate(model) {
    this.belongsTo(model.Student, { foreignKey: 'student_id' });
  }
}

export default HelpOrders;
