import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init(connection) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.DECIMAL(10, 2),
        description: Sequelize.INTEGER,
      },
      {
        sequelize: connection,
      }
    );
  }
}
export default Plan;
