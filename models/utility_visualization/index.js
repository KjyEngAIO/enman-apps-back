const { SELECT, INSERT, UPDATE, DELETE } = require("../../traits/query-types");
const connect = require("./../../config/connection");

exports.select = async (query) => {
  const result = await connect.connectUtilVisual.query(
    query,
    SELECT
  );
  return result;
}

exports.insert = async (query) => {
  const result = await connect.connectUtilVisual.query(
    query,
    INSERT
  );
  return result;
}

exports.update = async (query) => {
  const result = await connect.connectUtilVisual.query(
    query,
    UPDATE
  );
  return result;
}

exports.delete = async (query) => {
  const result = await connect.connectUtilVisual.query(
    query,
    DELETE
  );
  return result;
}