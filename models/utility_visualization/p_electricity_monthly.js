// var table = "test_p_electricity_monthly";
var table = "p_electricity_monthly";
var joinTable = {
  p_products: "p_products",
};
const moment = require("moment/moment");
var currentYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 1 : moment().format('YYYY')
var lastYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 2 : moment().format('YYYY') -1

exports.groupByMonth = (year) => {
  const query = `SELECT 
        pe.date, pe.month, 
        IFNULL(pe.pln_kwh, 0) as pln_kwh, 
        IFNULL(pe.pln_kwh_oc1, 0) as pln_kwh_oc1, 
        IFNULL(pe.pln_kwh_oc2, 0) as pln_kwh_oc2, 
        IFNULL(pe.pln_kwh_fsb, 0) as pln_kwh_fsb,
        IFNULL((pe.pln_kwh_oc1/pp.filled_bottle_350_OC1), 0) AS indeks_oc1,
        IFNULL((pe.pln_kwh_oc2/pp.filled_bottle_350_OC2), 0) AS indeks_oc2,
        IFNULL((pe.pln_kwh_fsb/pp.pillow_bar), 0) AS indeks_fsb,
        IFNULL((pe.pln_kwh/pp.filled_bottle_350), 0) AS indeks_general
        FROM ${table} pe, ${joinTable.p_products} pp
    WHERE DATE(pe.date) = DATE(pp.date) 
    and YEAR(pe.date)=${year}
    GROUP BY pe.month
    ORDER BY pe.date`;
  return query;
};

exports.groupByYear = () => {
  const query = `SELECT 
	YEAR(pe.date) as year, 
	IFNULL(SUM(pe.pln_kwh), 0) as pln_kwh, 
	IFNULL(SUM(pe.pln_kwh_oc1), 0) as pln_kwh_oc1, 
	IFNULL(SUM(pe.pln_kwh_oc2), 0) as pln_kwh_oc2, 
	IFNULL(SUM(pe.pln_kwh_fsb), 0) as pln_kwh_fsb,
	IFNULL(SUM(pp.filled_bottle_350), 0) as filled_bottle_350,
	IFNULL(SUM(pp.filled_bottle_350_OC1), 0) as filled_bottle_350_OC1,
	IFNULL(SUM(pp.filled_bottle_350_OC2), 0) as filled_bottle_350_OC2,
	IFNULL(SUM(pp.pillow_bar), 0) as pillow_bar,
	IFNULL(AVG((pe.pln_kwh_oc1/pp.filled_bottle_350_OC1)), 0) AS indeks_oc1,
	IFNULL(AVG((pe.pln_kwh_oc2/pp.filled_bottle_350_OC2)), 0) AS indeks_oc2,
	IFNULL(AVG((pe.pln_kwh_fsb/pp.pillow_bar)), 0) AS indeks_fsb,
	IFNULL(AVG((pe.pln_kwh/pp.filled_bottle_350)), 0) AS indeks_general
    FROM ${table} pe, ${joinTable.p_products} pp
    WHERE DATE(pe.date) = DATE(pp.date) 
    GROUP BY year
    ORDER BY pe.date`;
  return query;
};

exports.persentaseMTD = (year) => {
  const query = `SELECT 
        pe.date, pe.month, 
        IFNULL((pe.pln_kwh/pp.filled_bottle_350), 0) AS indeks_general
        FROM ${table} pe, ${joinTable.p_products} pp
    WHERE DATE(pe.date) = DATE(pp.date) 
    and YEAR(pe.date)=${year}
    GROUP BY pe.month
    ORDER BY pe.date DESC
    LIMIT 1`;
  return query;
};

exports.persentaseYTD = (year) => {
  const query = `SELECT 
	YEAR(pe.date) as year, 
	IFNULL(AVG((pe.pln_kwh/pp.filled_bottle_350)), 0) AS indeks_general
    FROM ${table} pe, ${joinTable.p_products} pp
    WHERE DATE(pe.date) = DATE(pp.date) 
    and YEAR(pe.date)=${year}
    GROUP BY year
    ORDER BY pe.date DESC
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
      ${body.column},
      updated_at='${body.updated_at}'
    WHERE date='${body.start}'`;
  return query;
}

exports.lytdElectricityPlanReport = () => {
  const query = `SELECT 
	YEAR(pe.date) as year, 
	IFNULL(SUM(pe.pln_kwh), 0) as pln_kwh, 
	IFNULL(SUM(pp.filled_bottle_350), 0) as filled_bottle_350,
  ROUND(IFNULL(AVG((pe.pln_kwh/pp.filled_bottle_350)), 0), 2) AS index_lytd
    FROM ${table} pe, ${joinTable.p_products} pp
    WHERE DATE(pe.date) = DATE(pp.date) 
    AND YEAR(pe.date)=  ${lastYear}`;
  return query;
};
exports.ytdElectricityPlanReport = () => {
  const query = `SELECT 
	YEAR(pe.date) as year, 
	IFNULL(SUM(pe.pln_kwh), 0) as pln_kwh, 
	IFNULL(SUM(pp.filled_bottle_350), 0) as filled_bottle_350,
  ROUND(IFNULL(AVG((pe.pln_kwh/pp.filled_bottle_350)), 0), 2) AS index_ytd
    FROM ${table} pe, ${joinTable.p_products} pp
    WHERE DATE(pe.date) = DATE(pp.date) 
    AND YEAR(pe.date)=  ${currentYear}`;
  return query;
};