import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        weight: Sequelize.INTEGER,
        age: Sequelize.INTEGER,
        height: Sequelize.INTEGER,
      },
      {
        sequelize: connection,
      }
    );
  }
}

export default Student;
