const Company = require('../models/company');

// Add a company
exports.addCompany = async (req, res) => {
  try {
    const { name, contactDetails, size, industry, notes } = req.body;
    const company = await Company.createCompany({ name, contactDetails, size, industry, notes });
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add company' });
  }
};

// Get all companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

// Get a company by ID
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findByIdCustom(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch company' });
  }
};

// Update a company
exports.updateCompany = async (req, res) => {
  try {
    const updated = await Company.updateById(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'No company found with the given ID' });
    }
    res.status(200).json({ message: 'Company updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update company' });
  }
};

// Delete a company
exports.deleteCompany = async (req, res) => {
  try {
    const deleted = await Company.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'No company found with the given ID' });
    }
    res.json({ message: 'Company deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete company' });
  }
};