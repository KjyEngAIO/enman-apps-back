var table = 'energy_gj_per_kl';
const moment = require("moment/moment");
var currentYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 1 : moment().format('YYYY')
var lastYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 2 : moment().format('YYYY') -1

exports.findAll = () => {
	const query = `SELECT 
      MONTH(e.bulan) as bulan_num,
      DATE_FORMAT(e.bulan, '%Y') AS tahun,
      DATE_FORMAT(e.bulan, '%M') AS bulan,
      e.Total_ENERGY_CALORY as gj, e.Product_KL as kl, 
      (e.Total_ENERGY_CALORY / e.Product_KL) AS gj_kl
    FROM ${table} as e
    WHERE YEAR(e.bulan) >= 2021
    GROUP BY e.bulan
    ORDER BY bulan_num ASC`
	return query;
};

exports.getEnergyPerKlMonthFrom2021 = (data) => {
  const response = {
    tahun2021: [],
    tahun2022: [],
    tahun2023: [],
  }
  data.forEach(item => {
    switch(parseInt(item.tahun)){
      case 2021:
        response.tahun2021.push({
          tahun: item.tahun,
          bulan: item.bulan,
          gj: item.gj,
          kl: item.kl,
          gj_kl: item.gj_kl,
        });
        break;
      case 2022:
        response.tahun2022.push({
          tahun: item.tahun,
          bulan: item.bulan,
          gj: item.gj,
          kl: item.kl,
          gj_kl: item.gj_kl,
        });
        break;
      case 2023:
        response.tahun2023.push({
          tahun: item.tahun,
          bulan: item.bulan,
          gj: item.gj,
          kl: item.kl,
          gj_kl: item.gj_kl,
        });
        break;
    }
  });

  return response;
};

// MENU TON OIL EQV
exports.findToeYearly = () => {
  const query = `SELECT 
	date_format(bulan, '%Y') as year, 
  SUM(Total_ENERGY_CALORY*0.02031) AS toe
  FROM ${table}    
  WHERE YEAR(bulan) >= 2017
  GROUP BY YEAR(bulan)`;
  return query;
};

exports.findToeMonthly = (year) => {
  const query = `SELECT 
	date_format(bulan, '%Y') as year, 
	date_format(bulan, '%M') as month,  
  (Total_ENERGY_CALORY*0.02031) AS toe
  FROM ${table}     
  WHERE YEAR(bulan) = ${year}
  GROUP BY bulan
  ORDER BY bulan`;
  return query;
};

exports.getPercentaseGjKlEnergy = (year) => {
  const query = `SELECT
  YEAR(bulan) AS tahun,
  SUM(electricity) AS total_electricity,
  SUM(city_gas) AS total_city_gas,
  SUM(diesel_oil) AS total_diesel_oil,
  (SUM(electricity) / SUM(electricity + city_gas + diesel_oil)) * 100 AS percentage_electricity,
  (SUM(city_gas) / SUM(electricity + city_gas + diesel_oil)) * 100 AS percentage_city_gas,
  (SUM(diesel_oil) / SUM(electricity + city_gas + diesel_oil)) * 100 AS percentage_diesel_oil
  FROM ${table}  
  WHERE YEAR(bulan) > 2020
  GROUP BY YEAR(bulan)
  ORDER BY tahun ASC;`;
  return query;
};

exports.getTotalEnergyGJYearly = (year) => {
  const query = `SELECT YEAR(bulan) AS tahun, 
  SUM(Total_ENERGY_CALORY) AS total_energy_yearly
  FROM ${table}  
  WHERE YEAR(bulan) >= 2017 AND YEAR(bulan) <= ${year}
  GROUP BY YEAR(bulan)`;
  return query;
};

exports.getTotalEnergyGJMonthly = (year) => {
  const query = `SELECT SUBSTRING(MONTHNAME(bulan), 1, 3) AS bulan,
  (Electricity+City_gas+Diesel_oil) AS total_energy_monthly
  FROM ${table}  
  WHERE YEAR(bulan) = ${year}`;
  return query;
}

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
