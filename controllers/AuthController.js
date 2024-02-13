/////////////////////////////
// IMPORTING & REQUIRERING //
/////////////////////////////
var bodyParser = require("body-parser");
var express = require("express");
// const db = require("../models");
const jwt = require("jsonwebtoken");
var aioEmployee = require('./../models/aio_employee/');
var modelPhpMsLogin = require('./../models/aio_employee/php_ms_login');
var utilityVisualization = require('./../models/utility_visualization/');
var modelHstLogin = require('./../models/utility_visualization/hst_logins');
var modelHstInteraction = require('./../models/utility_visualization/hst_interactions');
const CryptoJS = require('crypto-js');

var app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = CryptoJS.MD5(password).toString();
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    if (username == "" || password == "") {
      return res
      .status(400)
      .json({ message: "Please fill all fields before submit" });
    }
    
    const findUserByNIK = await aioEmployee.select(
      modelPhpMsLogin.login(username)
      );
      
      if (
        findUserByNIK.length === 0 ||
      findUserByNIK[0].lg_password !== hashedPassword
    ) {
      return res
      .status(400)
        .json({ message: "Please check your NIK or Password" });
      }
      
    const response = await aioEmployee.select(
      modelPhpMsLogin.login_nik(username, hashedPassword)
    );
    if (response.length === 0) {
      return res
      .status(400)
      .json({ message: "Please check your NIK or Password" });
    }

    const data = {
      nik: response[0].lg_nik,
      name: response[0].lg_name,
      email: response[0].lg_email_aio,
      workloc: (username != '0000') ? response[0].org_work_locn_code : 'WL004',
      isEmployee: true,
    };
    const token = jwt.sign(data, process.env.JWT_KEY);

    if (ipAddress.split(',')[0].replace('::ffff:', '') !== '127.0.0.1') {
      await utilityVisualization.insert(
        modelHstLogin.create(token, response[0].lg_nik, response[0].lg_name, ipAddress.split(',')[0].replace('::ffff:', ''))
      );
    }

    res.status(200).json({
      token, data
    });
  } catch (error) {
    return res
        .status(500)
        .json({ message: error.message });
  }
}

exports.logout = async (req, res) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const { username } = decoded;
    const response = await db.User.findOne({ where: { username: username } });

    if (response.token == "") {
      return res.status(201).send("You Already Logout");
    } else {
      await response.update({ token: "" });
      return res.status(201).json({
        message: "Logout Succesfully",
        response,
      });
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

exports.histories = async (req, res) => {
  try {
    const start = req.query.start;
    const end = req.query.end;

    const groupBy = await utilityVisualization.select(
      modelHstLogin.findByDate(start, end)
    )
    const lists = await utilityVisualization.select(
      modelHstLogin.findAll(start, end)
    )

    return res.status(200).json({
      charts: groupBy,
      tables: lists
    })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}

exports.interactions = async (req, res) => {
  try {
    const body = req.body;
    await utilityVisualization.insert(
      modelHstInteraction.create(body.nik, body.name, body.method, body.url)
    )

    console.log('Interactions inserted successfully');
  } catch (e) {
    console.log({ message: e.message });
  }
}

exports.authToken = async (req, res) => {
  try {
    const token = req.query.token;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const response = await utilityVisualization.select(
      modelHstLogin.findByToken(token)
    );

    if (response.length === 0) {
      return res.status(401).json({ message: 'Invalid Token' });
    }

    if (ipAddress.split(',')[0].replace('::ffff:', '') !== '127.0.0.1') {
      await energyUtilML.insert(
        modelHstLoginML.create(token, response[0].nik, response[0].name, response[0].ip_address)
      );
    }

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}