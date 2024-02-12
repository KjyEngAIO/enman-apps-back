const { QueryTypes } = require("sequelize");

const qTypes = (params) => {
  var types = null;
  switch(params){
    case 'SELECT':
      types = QueryTypes.SELECT
      break;
    case 'INSERT':
      types = QueryTypes.INSERT
      break;
    case 'UPDATE':
      types = QueryTypes.UPDATE
      break;
    case 'DELETE':
      types = QueryTypes.DELETE
      break;
  }
  return { type: types };
}

exports.SELECT = qTypes('SELECT');
exports.INSERT = qTypes('INSERT');
exports.UPDATE = qTypes('UPDATE');
exports.DELETE = qTypes('DELETE');
