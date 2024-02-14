var table = "detail_downtime";

// Chart Big Downtime
exports.getBigDowntimeUtility = (tahun) => {
  const query = `SELECT mesin, sum(downtime) as downtime FROM ${table} 
  WHERE YEAR(create_date) = ${tahun}
  GROUP BY mesin ORDER BY downtime DESC`;
  return query;
};