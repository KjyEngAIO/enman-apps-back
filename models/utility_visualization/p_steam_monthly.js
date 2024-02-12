// var table = "test_p_steam_monthly";
var table = "p_steam_monthly";
var joinTable = {
  p_products: "p_products",
};
const moment = require("moment/moment");
var currentYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 1 : moment().format('YYYY')
var lastYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 2 : moment().format('YYYY') -1

exports.groupByMonth = (year) => {
  const query = `SELECT 
      ps.date, ps.month, 
      IFNULL(ps.boiler, 0) as boiler, 
      IFNULL(ps.steam, 0) as steam, 
      IFNULL(ps.steam_oc1, 0) as steam_oc1, 
      IFNULL(ps.steam_oc2, 0) as steam_oc2, 
      IFNULL(ps.steam_fsb, 0) as steam_fsb,
      IFNULL(((ps.steam_oc1/pp.filled_bottle_350_OC1) * 100000), 0) AS indeks_oc1,
      IFNULL(((ps.steam_oc2/pp.filled_bottle_350_OC2) * 100000), 0) AS indeks_oc2,
      IFNULL(((ps.steam_fsb/pp.pillow_bar) * 100000), 0) AS indeks_fsb,
      IFNULL((ps.boiler/ps.steam), 0) AS indeks_general
    FROM ${table} ps, ${joinTable.p_products} pp
    WHERE DATE(ps.date) = DATE(pp.date) 
    and YEAR(ps.date)=${year}
    GROUP BY ps.month
    ORDER BY ps.date`;
  return query;
};

exports.groupByYear = () => {
  const query = `SELECT 
      YEAR(ps.date) as year, 
      IFNULL(AVG(ps.boiler), 0) AS boiler, 
      IFNULL(AVG(ps.steam), 0) AS steam, 
      IFNULL(AVG(ps.steam_oc1), 0) AS steam_oc1, 
      IFNULL(AVG(ps.steam_oc2), 0) AS steam_oc2, 
      IFNULL(AVG(ps.steam_fsb), 0) AS steam_fsb,
      IFNULL(AVG(((ps.steam_oc1/pp.filled_bottle_350_OC1) * 100000)), 0) AS indeks_oc1,
      IFNULL(AVG(((ps.steam_oc2/pp.filled_bottle_350_OC2) * 100000)), 0) AS indeks_oc2,
      IFNULL(AVG(((ps.steam_fsb/pp.pillow_bar) * 100000)), 0) AS indeks_fsb,
      IFNULL(AVG((ps.boiler/ps.steam)), 0) AS indeks_general
    FROM ${table} ps, ${joinTable.p_products} pp
    WHERE DATE(ps.date) = DATE(pp.date) 
    GROUP BY year
    ORDER BY ps.date`;
  return query;
};

exports.persentaseMTD = (year) => {
  const query  = `SELECT 
    ps.date, ps.month, 
    IFNULL((ps.boiler/ps.steam), 0) AS indeks_general
  FROM ${table} ps, ${joinTable.p_products} pp
  WHERE DATE(ps.date) = DATE(pp.date) 
  and YEAR(ps.date)=${year}
  GROUP BY ps.month
  ORDER BY ps.date DESC
  LIMIT 1`;
  return query;
}

exports.persentaseYTD = (year) => {
  const query  = `SELECT 
    YEAR(ps.date) as year, 
    IFNULL(AVG((ps.boiler/ps.steam)), 0) AS indeks_general
  FROM ${table} ps, ${joinTable.p_products} pp
  WHERE DATE(ps.date) = DATE(pp.date) 
  and YEAR(ps.date)=${year}
  GROUP BY year
  ORDER BY ps.date DESC
  LIMIT 1`;
  return query;
}

exports.create = (body) => {
  const query = `INSERT INTO ${table} 
    VALUES(
      null, 
      '${body.start}',
      '${body.month}',
      ${body.boiler},
      ${body.steam},
      ${body.steam_oc1},
      ${body.steam_oc2},
      ${body.steam_fsb},
      '${body.created_at}',
      '${body.updated_at}'
    )`;
  return query;
}

exports.lytdSteamPlanReport = () => {
  const query = `SELECT 
      YEAR(ps.date) as year, 
      IFNULL(AVG(ps.boiler), 0) AS boiler, 
      IFNULL(AVG(ps.steam), 0) AS steam, 
      ROUND(IFNULL(AVG((ps.boiler/ps.steam)), 0), 2) AS index_lytd
    FROM ${table} ps, ${joinTable.p_products} pp
    WHERE DATE(ps.date) = DATE(pp.date) 
    AND YEAR(ps.date)=  ${lastYear}`;
  return query;
};
exports.ytdSteamPlanReport = () => {
  const query = `SELECT 
      YEAR(ps.date) as year, 
      IFNULL(AVG(ps.boiler), 0) AS boiler, 
      IFNULL(AVG(ps.steam), 0) AS steam, 
      ROUND(IFNULL(AVG((ps.boiler/ps.steam)), 0), 2) AS index_ytd
    FROM ${table} ps, ${joinTable.p_products} pp
    WHERE DATE(ps.date) = DATE(pp.date) 
    AND YEAR(ps.date)=  ${currentYear}`;
  return query;
};