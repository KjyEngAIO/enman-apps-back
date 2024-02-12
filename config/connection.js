const Sequelize = require("sequelize");
const config = require("./config.json");

const db = (database) => {
  const server = {
    database: config[database].database,
    username: config[database].username,
    password: config[database].password,
    config: config[database],
  };

  return new Sequelize(
    server.database,
    server.username,
    server.password,
    server.config
  );
};

exports.connectEnergy = db("energy");
exports.connectUtilVisual = db("utility_visualization");
exports.connectEmployee = db('employee');
