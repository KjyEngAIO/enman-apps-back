var utilVisual = require("./../../models/utility_visualization/");
var modelWater = require("./../../models/utility_visualization/p_water_monthly");
var modelElectricity = require("./../../models/utility_visualization/p_electricity_monthly");
var energy = require("./../../models/energy/");
var modelSteam = require("./../../models/utility_visualization/p_steam_monthly");
var modelProduct = require("./../../models/utility_visualization/p_products");
var modelEnergyGjPerKl = require("./../../models/energy/energy_gj_per_kl");
var apiResponse = require('./../../traits/api-response');
var modelDetailDowntime = require("./../../models/utility_visualization/detail_downtime");

exports.getWaterIndex = async (req, res) => {
	try {
		let result = {};
		result.water_lytd = await utilVisual.select(
			modelWater.lytdWaterPlanReport()
		);
		result.water_ytd = await utilVisual.select(
			modelWater.ytdWaterPlanReport()
		);

		apiResponse.success(res, result, 200)
	} catch (e) {
		apiResponse.errors(res, e.message, 500)
	}
};

exports.getElectricityIndex = async (req, res) => {
	try {
		let result = {}
		result.electricity_lytd = await utilVisual.select(
			modelElectricity.lytdElectricityPlanReport()
		);
		result.electricity_ytd = await utilVisual.select(
			modelElectricity.ytdElectricityPlanReport()
		);

		return res.status(201).json(result);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.getSteamIndex = async (req, res) => {
	try {
		let result = {}
		result.steam_lytd = await utilVisual.select(
			modelSteam.lytdSteamPlanReport()
		);
		result.steam_ytd = await utilVisual.select(
			modelSteam.ytdSteamPlanReport()
		);

		return res.status(201).json(result);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.getEnergyIndexGjKl = async (req, res) => {
	try {
		let result = {}
		result.energy_lytd = await energy.select(
			modelEnergyGjPerKl.lytdEnergyIndexPlanReport()
		);
		result.energy_ytd = await energy.select(
			modelEnergyGjPerKl.ytdEnergyIndexPlanReport()
		);

		return res.status(201).json(result);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.getProductionOutput = async (req, res) => {
	try {
		const response = await utilVisual.select(
			modelProduct.productionOutput()
		);

		return res.status(201).json(response[0]);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.getBigDowntimeUtility = async (req, res) => {
	try {
	  const tahun = req.query.tahun;
	  var response = await utilVisual.select(
		modelDetailDowntime.getBigDowntimeUtility(tahun)
	  );
	  return res.status(200).json(response);
	} catch (error) {
	  return res.status(500).json({ error: error.message });
	}
  };
  