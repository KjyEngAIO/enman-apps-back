// var table = "test_p_water_monthly";
var table = "p_water_monthly";
var joinTable = {
  p_products: "p_products",
};
const moment = require("moment/moment");
var currentYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 1 : moment().format('YYYY')
var lastYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 2 : moment().format('YYYY') -1

exports.groupByMonth = (year) => {
  const query = `SELECT 
      pw.date, pw.month, 
      IFNULL(pw.water, 0) as water, 
      IFNULL(pw.water_oc1, 0) as water_oc1, 
      IFNULL(pw.water_oc2, 0) as water_oc2, 
      IFNULL(pw.water_fsb, 0) as water_fsb,
      IFNULL(((pw.water_oc1/pp.filled_bottle_350_OC1) * 1000), 0) AS indeks_oc1,
      IFNULL(((pw.water_oc2/pp.filled_bottle_350_OC2) * 1000), 0) AS indeks_oc2,
      IFNULL(((pw.water_fsb/pp.pillow_bar) * 1000), 0) AS indeks_fsb,
      IFNULL(((pw.water/pp.filled_bottle_350) * 1000), 0) AS indeks_general
    FROM ${table} pw, ${joinTable.p_products} pp
    WHERE DATE(pw.date) = DATE(pp.date) 
    and YEAR(pw.date)=${year}
    GROUP BY pw.month
    ORDER BY pw.date`;
  return query;
};

exports.groupByYear = () => {
  const query = `SELECT 
      YEAR(pw.date) as year, 
      IFNULL(SUM(pw.water), 0) as water, 
      IFNULL(AVG(pw.water_oc1), 0) as water_oc1, 
      IFNULL(AVG(pw.water_oc2), 0) as water_oc2, 
      IFNULL(AVG(pw.water_fsb), 0) as water_fsb,
      IFNULL(AVG(((pw.water_oc1/pp.filled_bottle_350_OC1) * 1000)), 0) AS indeks_oc1,
      IFNULL(AVG(((pw.water_oc2/pp.filled_bottle_350_OC2) * 1000)), 0) AS indeks_oc2,
      IFNULL(AVG(((pw.water_fsb/pp.pillow_bar) * 1000)), 0) AS indeks_fsb,
      IFNULL(AVG(((pw.water/pp.filled_bottle_350) * 1000)), 0) AS indeks_general
    FROM ${table} pw, ${joinTable.p_products} pp
    WHERE DATE(pw.date) = DATE(pp.date) 
    GROUP BY year
    ORDER BY pw.date`;
  return query;
};

exports.persentaseMTD = (year) => {
  const query = `SELECT 
      pw.date, pw.month, 
      IFNULL(((pw.water/pp.filled_bottle_350) * 1000), 0) AS indeks_general
    FROM ${table} pw, ${joinTable.p_products} pp
    WHERE DATE(pw.date) = DATE(pp.date) 
    and YEAR(pw.date)=${year}
    GROUP BY pw.month
    ORDER BY pw.date DESC 
    LIMIT 1`;
  return query;
};

exports.persentaseYTD = (year) => {
  const query = `SELECT 
      YEAR(pw.date) as year, 
      IFNULL(AVG(((pw.water/pp.filled_bottle_350) * 1000)), 0) AS indeks_general
    FROM ${table} pw, ${joinTable.p_products} pp
    WHERE DATE(pw.date) = DATE(pp.date) 
    AND YEAR(pw.date)=${year}
    GROUP BY year
    ORDER BY pw.date DESC 
    LIMIT 1`;
  return query;
};

exports.create = (body) => {
  const query = `INSERT INTO ${table} 
    VALUES(
      null, 
      '${body.start}',
      '${body.month}',
      0, 0, 0, 0,
      '${body.created_at}',
      '${body.updated_at}'
    )`;
  return query;
}

exports.update = (body) => {
  const query = `UPDATE ${table} SET 
      water=${body.water},
      water_oc1=${body.water_oc1},
      water_oc2=${body.water_oc2},
      water_fsb=${body.water_fsb},
      updated_at='${body.updated_at}'
    WHERE date='${body.start}'`;
    console.log(query);
  return query;
}

exports.lytdWaterPlanReport = () => {
  const query = `SELECT 
      YEAR(pw.date) as year, 
      IFNULL(pw.water, 0) as water, 
      IFNULL(pp.filled_bottle_350, 0) as filled_bottle_350, 
      ROUND(IFNULL(AVG(((pw.water/pp.filled_bottle_350) * 1000)), 0), 2) AS index_lytd
    FROM ${table} pw, ${joinTable.p_products} pp
    WHERE DATE(pw.date) = DATE(pp.date) 
    AND YEAR(pw.date)=  ${lastYear}`;
    console.log(query);
  return query;
};
exports.ytdWaterPlanReport = () => {
  const query = `SELECT 
      YEAR(pw.date) as year, 
      IFNULL(pw.water, 0) as water, 
      IFNULL(pp.filled_bottle_350, 0) as filled_bottle_350, 
      ROUND(IFNULL(AVG(((pw.water/pp.filled_bottle_350) * 1000)), 0), 2) AS index_ytd
    FROM ${table} pw, ${joinTable.p_products} pp
    WHERE DATE(pw.date) = DATE(pp.date) 
    AND YEAR(pw.date)=  ${currentYear}`;
    console.log(query);
  return query;
};
