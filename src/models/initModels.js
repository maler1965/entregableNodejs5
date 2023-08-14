const { Repairs } = require('./repairs.model');
const User = require('./user.model');

const initModel = () => {
  User.hasMany(Repairs, { foreignKey: 'userId' });
  Repairs.belongsTo(User, { foreignKey: 'userId' }); //
};

module.exports = initModel;
