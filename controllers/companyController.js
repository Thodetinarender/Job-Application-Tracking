const Company = require('../models/company');
const { ObjectId } = require('mongodb');

exports.addCompany = async (req, res) => {
  try {
    const { name, contactDetails, size, industry, notes } = req.body;
    const company = await Company.create({ name, contactDetails, size, industry, notes });
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add company' });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch company' });
  }
};


exports.updateCompany = async (req, res) => {
    const id = req.params.id;
    let objectId;
    try {
        objectId = new ObjectId(id);
    } catch (err) {
        return res.status(400).json({ error: 'Invalid company ID format.' });
    }

    try {
        const updated = await Company.updateById(objectId, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'No company found with the given ID' });
        }
        res.status(200).json({ message: 'Company updated successfully' });
    } catch (err) {
        console.error('Error updating company:', err.message);
        res.status(500).json({ error: 'Failed to update company' });
    }
};
exports.deleteCompany = async (req, res) => {
  try {
    await Company.deleteById(req.params.id);
    res.json({ message: 'Company deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error:err.message|| 'Failed to delete company' });
  }
};

// const Company = require('../models/company');

// exports.addCompany = async (req, res) => {
//   const { name, contactDetails, size, industry, notes } = req.body;
//   const company = await Company.create({ name, contactDetails, size, industry, notes });
//   res.status(201).send(company);
// };

// exports.getCompanies = async (req, res) => {
//   try {
//     const companies = await Company.findAll({
//       attributes: ['id', 'name', 'contactDetails', 'size', 'industry', 'notes'], // Fetch all required fields
//       raw: true,
//     });

//     console.log('Fetched companies from database:', companies); // Debugging log
//     res.status(200).json(companies); // Return the list of companies
//   } catch (err) {
//     console.error('Error fetching companies:', err.message);
//     res.status(500).json({ error: 'Failed to fetch companies' });
//   }
// };

// exports.getCompany = async (req, res) => {
//   const company = await Company.findByPk(req.params.id);
//   if (!company) {
//     return res.status(404).send({ error: 'Company not found.' });
//   }
//   res.send(company);
// };

// exports.updateCompany = async (req, res) => {
//   const { name, contactDetails, size, industry, notes } = req.body;
//   const company = await Company.findByPk(req.params.id);
//   if (!company) {
//     return res.status(404).send({ error: 'Company not found.' });
//   }
//   company.name = name;
//   company.contactDetails = contactDetails;
//   company.size = size;
//   company.industry = industry;
//   company.notes = notes;
//   await company.save();
//   res.send(company);
// };

// exports.deleteCompany = async (req, res) => {
//   const company = await Company.findByPk(req.params.id);
//   if (!company) {
//     return res.status(404).send({ error: 'Company not found.' });
//   }
//   await company.destroy();
//   res.send({ message: 'Company deleted successfully.' });
// };

// exports.saveJobListing = async (req, res) => {
//   const { companyId, jobTitle, jobDescription } = req.body;

//   try {
//     const company = await Company.findByPk(companyId);
//     if (!company) {
//       return res.status(404).json({ error: 'Company not found' });
//     }

//     const jobListing = await JobListing.create({ companyId, jobTitle, jobDescription });
//     res.status(201).json({ message: 'Job listing saved successfully', jobListing });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to save job listing' });
//   }
// };