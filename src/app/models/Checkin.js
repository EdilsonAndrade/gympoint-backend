import Sequelize, { Model } from 'sequelize';

class Checkin extends Model {
  static init(connection) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
      },
      {
        sequelize: connection,
      }
    );
    return this;
  }

  static associate(model) {
    this.belongsTo(model.Student, { foreignKey: 'id' });
  }
}

export default Checkin;
