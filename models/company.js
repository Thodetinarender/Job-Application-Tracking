const { ObjectId } = require('mongodb');
const getdb = require('../config/db').getdb;

class Company {
  constructor(name, contactDetails, size, industry, notes) {
    this.name = name;
    this.contactDetails = contactDetails;
    this.size = size;
    this.industry = industry;
    this.notes = notes;
  }

  async save() {
    const db = getdb();
    try {
      const result = await db.collection('companies').insertOne(this);
      return result.ops?.[0] || { insertedId: result.insertedId, ...this };
    } catch (err) {
      console.error('Error saving company:', err.message);
      throw err;
    }
  }

  static async create(data) {
    const company = new Company(
      data.name,
      data.contactDetails,
      data.size,
      data.industry,
      data.notes
    );
    return await company.save();
  }

  static async findByPk(id) {
    const db = getdb();
    try {
      const company = await db.collection('companies').findOne({ _id: new ObjectId(id) });
      return company;
    } catch (err) {
      console.error('Error fetching company by ID:', err.message);
      throw err;
    }
  }

  static async updateById(id, updateData) {
    const db = getdb();
    const result = await db.collection('companies').updateOne(
        { _id: id },
        { $set: updateData }
    );
    return result.matchedCount > 0;
}

  static async deleteById(id) {
    const db = getdb();
    try {
      const result = await db.collection('companies').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        throw new Error('No company found with the given ID');
      }
      return result;
    } catch (err) {
      console.error('Error deleting company:', err.message);
      throw err;
    }
  }

  static async findAll() {
    const db = getdb();
    try {
      const companies = await db.collection('companies').find({}).project({
        name: 1,
        contactDetails: 1,
        size: 1,
        industry: 1,
        notes: 1,
      }).toArray();
      return companies;
    } catch (err) {
      console.error('Error fetching companies:', err.message);
      throw err;
    }
  }
}

module.exports = Company;
