const express = require('express');
const router = express.Router();
const { getCountries, getStates, getCities } = require('../../controllers/locationController.js');

// GET: Getting Countries
router.get('/countries', getCountries);

// GET: Gettig States
router.get('/states/:country', getStates);

// GET: Getting Cities
router.get('/cities/:country/:state', getCities);

// Exporting Modules
module.exports = router;
