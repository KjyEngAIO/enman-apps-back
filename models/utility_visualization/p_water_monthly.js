// var table = "test_p_water_monthly";
var table = "p_water_monthly";
var joinTable = {
  p_products: "p_products",
};
const moment = require("moment/moment");
var currentYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 1 : moment().format('YYYY')
var lastYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 2 : moment().format('YYYY') -1

exports.lytdWaterPlanReport = () => {
  const query = `SELECT 
      YEAR(pw.date) as year, 
      IFNULL(pw.water, 0) as water, 
      IFNULL(pp.filled_bottle_350, 0) as filled_bottle_350, 
      ROUND(IFNULL(AVG(((pw.water/pp.filled_bottle_350) * 1000)), 0), 2) AS index_lytd
    FROM ${table} pw, ${joinTable.p_products} pp
    WHERE DATE(pw.date) = DATE(pp.date) 
    AND YEAR(pw.date)=  ${lastYear}`;
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
  return query;
};
