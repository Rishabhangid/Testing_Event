const express = require('express');
const router = express.Router();
const { getCountries, getStates, getCities } = require('../../controllers/locationController.js');

// Routes
router.get('/countries', getCountries);
router.get('/states/:country', getStates);
router.get('/cities/:country/:state', getCities);

module.exports = router;
