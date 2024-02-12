var table = "p_products";
const moment = require("moment/moment");
var currentYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 1 : moment().format('YYYY')
var lastYear = (moment().format('MM') == 1) ? moment().format('YYYY') - 2 : moment().format('YYYY') -1

// Chart Trend Energy High Press Compressor
exports.ComparisonfindByYear = (tahun) => {
  const query = `SELECT 
			date_format(month, '%m-%Y') AS 'bulantahun', 
			date_format(month, '%m') AS 'bulan', 
			filled_bottle_350 as filled_bottle 
    FROM ${table} 
    WHERE YEAR(month)='${tahun}' 
    GROUP BY bulantahun 
    ORDER BY month ASC`;
  return query;
};

// Chart Trend Energy Low Press Compressor
exports.indexLpTotalizerComparison = (tahun) => {
  const query = `SELECT 
      date_format(month, '%m-%Y') AS 'monthyear', 
      filled_bottle_350 as filled_bottle 
    FROM ${table} WHERE YEAR(month)='${tahun}' 
    GROUP BY monthyear ORDER BY month ASC`;
  return query;
};

exports.findByYear = (year) => {
  const query = `SELECT 
      date_format(Month, '%m-%Y') as month, 
      date_format(Month, '%M') as months,  
      filled_bottle_350 
    FROM ${table} 
    WHERE year(Month)=${year}`;
  return query;
};

exports.findGroupByYear = () => {
  const query = `SELECT 
      YEAR(Month) as yearly, 
      SUM(filled_bottle_350) as filled_bottle_350
    FROM ${table} GROUP BY yearly`;
  return query;
};

exports.findAll = () => {
  const query = `SELECT 
      date_format(Month, '%m-%Y') as month, 
      date_format(Month, '%M') as months,  
      filled_bottle_350 
	  FROM ${table}`;
  return query;
};

exports.productionOutput = () => {
  const query = `    
    SELECT 
    SUM_${lastYear}.prod_filled_bottle AS prod_filled_bottle_lytd, 
    SUM_${lastYear}.prod_pillow_bar AS prod_pillow_bar_lytd,
    SUM_${currentYear}.prod_filled_bottle AS prod_filled_bottle_ytd,
    SUM_${currentYear}.prod_pillow_bar AS prod_pillow_bar_ytd,
    ENERGY_COST_${currentYear}.target_oc AS target_oc,
    ENERGY_COST_${currentYear}.target_fsb AS target_fsb,
    ROUND((ENERGY_COST_${lastYear}.oc_cost / SUM_${lastYear}.prod_filled_bottle),2) AS oc_cost_lytd,
    ROUND((ENERGY_COST_${currentYear}.oc_cost / SUM_${currentYear}.prod_filled_bottle),2) AS oc_cost_ytd,
    ROUND((ENERGY_COST_${lastYear}.fsb_cost / SUM_${lastYear}.prod_pillow_bar),2) AS fsb_cost_lytd,
    ROUND((ENERGY_COST_${currentYear}.fsb_cost / SUM_${currentYear}.prod_pillow_bar),2) AS fsb_cost_ytd,
    ((SUM_${currentYear}.prod_filled_bottle / SUM_${lastYear}.prod_filled_bottle) - 1) * 100 AS percent_filled_bottle,
    ((SUM_${currentYear}.prod_pillow_bar / SUM_${lastYear}.prod_pillow_bar) - 1) * 100 AS percent_pillow_bar
FROM 
    (SELECT 
        SUM(filled_bottle_350) AS prod_filled_bottle, 
        SUM(pillow_bar) AS prod_pillow_bar 
    FROM p_products 
    WHERE YEAR(DATE) = '${currentYear}') AS SUM_${currentYear},
    
    (SELECT 
        SUM(filled_bottle_350) AS prod_filled_bottle, 
        SUM(pillow_bar) AS prod_pillow_bar 
    FROM p_products 
    WHERE YEAR(DATE) = '${lastYear}') AS SUM_${lastYear},
    
    (SELECT oc_cost, fsb_cost FROM cost_plan_report
	 WHERE YEAR(date) = '${lastYear}') AS ENERGY_COST_${lastYear},
	 
	 (SELECT oc_cost, fsb_cost, target_oc, target_fsb FROM cost_plan_report
	 WHERE YEAR(date) = '${currentYear}') AS ENERGY_COST_${currentYear};`
  return query;
};