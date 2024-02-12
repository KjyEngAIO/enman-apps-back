var table = "hst_interactions";

exports.create = (nik, name, method, url) => {
  const query = `INSERT INTO ${table} (nik, name, method, url) VALUES('${nik}', '${name}', '${method}', '${url}')`;
  return query;
};
