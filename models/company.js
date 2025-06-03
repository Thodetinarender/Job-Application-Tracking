const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: { type: String, required: true },
  contactDetails: { type: String, required: true},
  size: { type: String, default: '' }, 
  industry: { type: String, default: '' },
  notes: { type: String, default: '' }
});

// Static: Create a company
CompanySchema.statics.createCompany = function(data) {
  return this.create(data);
};

// Static: Find all companies
CompanySchema.statics.findAll = function() {
  return this.find();
};

// Static: Find company by ID
CompanySchema.statics.findByIdCustom = function(id) {
  return this.findById(id);
};

// Static: Update company by ID
CompanySchema.statics.updateById = function(id, updateData) {
  return this.findByIdAndUpdate(id, updateData, { new: true });
};

// Static: Delete company by ID
CompanySchema.statics.deleteById = function(id) {
  return this.findByIdAndDelete(id);
};

module.exports = mongoose.model('Company', CompanySchema);