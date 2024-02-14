// var table = "test_p_steam_monthly";
var table = "p_steam_monthly";
var joinTable = {
  p_products: "p_products",
};
const moment = require("moment/moment");
var currentYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 1 : moment().format('YYYY')
var lastYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 2 : moment().format('YYYY') -1

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