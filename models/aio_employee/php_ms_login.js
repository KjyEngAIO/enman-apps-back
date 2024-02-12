var table = 'php_ms_login';

exports.auth = (username, password) => {
  const query = `SELECT * 
    FROM ${table} 
    WHERE lg_nik = '${username}' 
    AND lg_password = '${password}' LIMIT 1`;
  return query;
}
exports.login = (nik) => {
  const query = 
  `SELECT * FROM ${table} WHERE lg_nik = '${nik}' LIMIT 1`;
  console.log(query);
  return query;
}
exports.login_nik = (nik, hashedPassword) => {
  const query = 
  `SELECT * FROM ${table} WHERE lg_nik = '${nik}' 
  AND lg_password = '${hashedPassword}' AND lg_aktif = '1' LIMIT 1`;
  return query;
}