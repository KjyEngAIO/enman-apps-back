var table = 'energy_gj_per_kl';
const moment = require("moment/moment");
var currentYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 1 : moment().format('YYYY')
var lastYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 2 : moment().format('YYYY') -1

exports.lytdEnergyIndexPlanReport = () => {
  const query = `SELECT 
  DATE_FORMAT(e.bulan, '%Y') AS tahun,  
  AVG(Total_ENERGY_CALORY) AS GJ,
  AVG(Product_KL) AS KL,
  ROUND(IFNULL(AVG(Total_ENERGY_CALORY)/AVG(Product_KL), 0), 2) AS index_lytd
    FROM ${table} e
    WHERE YEAR(e.bulan)=  ${lastYear}`;
  return query;
};
exports.ytdEnergyIndexPlanReport = () => {
  const query = `SELECT 
  DATE_FORMAT(e.bulan, '%Y') AS tahun,  
  AVG(Total_ENERGY_CALORY) AS GJ,
  AVG(Product_KL) AS KL,
  ROUND(IFNULL(AVG(Total_ENERGY_CALORY)/AVG(Product_KL), 0), 2) AS index_ytd
      FROM ${table} e
      WHERE YEAR(e.bulan)=  ${currentYear}`;
  return query;
};
