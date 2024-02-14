var express = require('express')
var factoryReportController = require('../controllers/factory-report/PlanReportController')
var router = express.Router()

// FACTORY REPORT
router.get('/water-index', factoryReportController.getWaterIndex);
router.get('/electricity-index', factoryReportController.getElectricityIndex);
router.get('/steam-index', factoryReportController.getSteamIndex);
router.get('/energy-index-gj-kl', factoryReportController.getEnergyIndexGjKl);
router.get('/production-plan-report', factoryReportController.getProductionOutput);
router.get('/getbigdowntime', factoryReportController.getBigDowntimeUtility);

module.exports = router