var table = "hst_logins";

exports.findByDate = (start, end) => {
  const query = `SELECT 
      DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
      COUNT(*) AS total 
    FROM ${table} 
    WHERE created_at BETWEEN '${start}' AND '${end}'
    GROUP BY date`;
  return query;
};

exports.findAll = (start, end) => {
  const query = `SELECT 
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS date,
      IF(nik = '0000', 'Administrator', 'Guest') as user, 
      IF(nik = '0000', 'Admin E-Ranger', name) as name
    FROM ${table} 
    WHERE created_at BETWEEN '${start}' AND '${end}'
    ORDER BY date DESC`;
  return query;
};

exports.create = (token, nik, name, ip_address) => {
  const query = `INSERT INTO ${table} (token, nik, name, ip_address) VALUES('${token}', '${nik}', '${name}', '${ip_address}')`;
  return query;
};

exports.findByToken = (token) => {
  const query = `SELECT * FROM ${table} WHERE token='${token}'`;
  return query;
};
