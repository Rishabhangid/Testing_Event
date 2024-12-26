const express = require('express');
const router = express.Router();
const { Currency } = require('../../models');

// Create a new currency
router.post('/create', async (req, res) => {
  try {
    const { code, name, symbol, exchangeRate, isActive } = req.body;
    const newCurrency = await Currency.create({ code, name, symbol, exchangeRate, isActive });
    res.status(201).json({ success: true, data: newCurrency });
  } catch (error) {
    console.error('Error creating currency:', error);
    res.status(500).json({ success: false, message: 'Failed to create currency', error });
  }
});

// Get all currencies
router.get('/get', async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.status(200).json({ success: true, data: currencies });
  } catch (error) {
    console.error('Error fetching currencies:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch currencies', error });
  }
});

// Get a specific currency by ID
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findById(id);
    if (!currency) {
      return res.status(404).json({ success: false, message: 'Currency not found' });
    }
    res.status(200).json({ success: true, data: currency });
  } catch (error) {
    console.error('Error fetching currency:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch currency', error });
  }
});

// Update a currency by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, symbol, exchangeRate, isActive } = req.body;
    const updatedCurrency = await Currency.findByIdAndUpdate(
      id,
      { code, name, symbol, exchangeRate, isActive },
      { new: true, runValidators: true } // Return updated document and validate input
    );
    if (!updatedCurrency) {
      return res.status(404).json({ success: false, message: 'Currency not found' });
    }
    res.status(200).json({ success: true, message: 'Currency updated successfully', data: updatedCurrency });
  } catch (error) {
    console.error('Error updating currency:', error);
    res.status(500).json({ success: false, message: 'Failed to update currency', error });
  }
});

// Delete a currency by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCurrency = await Currency.findByIdAndDelete(id);
    if (!deletedCurrency) {
      return res.status(404).json({ success: false, message: 'Currency not found' });
    }
    res.status(200).json({ success: true, message: 'Currency deleted successfully' });
  } catch (error) {
    console.error('Error deleting currency:', error);
    res.status(500).json({ success: false, message: 'Failed to delete currency', error });
  }
});

module.exports = router;
