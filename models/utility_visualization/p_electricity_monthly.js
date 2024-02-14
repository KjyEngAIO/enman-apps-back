// var table = "test_p_electricity_monthly";
var table = "p_electricity_monthly";
var joinTable = {
  p_products: "p_products",
};
const moment = require("moment/moment");
var currentYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 1 : moment().format('YYYY')
var lastYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 2 : moment().format('YYYY') -1

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