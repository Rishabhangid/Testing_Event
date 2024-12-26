const { Country, State, City } = require("../models");


// Get unique countries
const getCountries = async (req, res) => {
  try {
    const countries = await Country.find()
    console.log(countries, "---------------countries---------------");
    res.status(200).json({ countries });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching countries', error });
  }
};

// Get unique states based on the country
const getStates = async (req, res) => {
  const { country } = req.params;
  try {
      const states = await State.find({country_id: country });
      console.log(states, "---------------country---------------",country);
    if (states.length === 0) {
      return res.status(404).json({ message: 'No states found for the given country' });
    }
    res.status(200).json({ states });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching states', error });
  }
};

// Get unique cities based on the country and state
const getCities = async (req, res) => {
  const { country, state } = req.params;
  try {
      const cities = await City.find({ country_id:country, state_id:state });
      console.log(cities, "---------------country,state---------------");
    if (cities.length === 0) {
      return res.status(404).json({ message: 'No cities found for the given state and country' });
    }
    res.status(200).json({ cities });
  } catch (error) {
    console.log(error, "---------------error---------------");
    res.status(500).json({ message: 'Error fetching cities', error });
  }
};

module.exports = { getCountries, getStates, getCities };
