const getdb = require('../config/db').getdb;

class Application{
  constructor(jobTitle, applicationDate, status, notes, filePath, userId) {
    this.jobTitle = jobTitle;
    this.applicationDate = applicationDate;
    this.status = status;
    this.notes = notes;
    this.filePath = filePath;
    this.userId = userId;
  }

  async save() {
    const db = getdb();
    try {
        const result = await db.collection('applications').insertOne(this);
        return result.ops?.[0] || { insertedId: result.insertedId, ...this };
    } catch (err) {
        console.error('Error saving application:', err.message);
        throw err;
    }
}

  

  static async findAllByUser(userId) {
    const db = getdb();
    try {
      const applications = await db.collection('applications').find({ userId: userId }).toArray();
      return applications;
    } catch (err) {
      console.error('Error fetching applications:', err.message);
      throw err;
    }
  }

  static async findById(id) {
    const db = getdb();
    try {
      const application = await db.collection('applications').findOne({ _id: id });
      return application;
    } catch (err) {
      console.error('Error fetching application by ID:', err.message);
      throw err;
    }
  }

  static async updateById(id, updatedData) {
    const db = getdb();
    try {
      const result = await db.collection('applications').updateOne( { _id: id }, 
        { $set: updatedData } ); 
      if (result.modifiedCount === 0) {
        throw new Error('No application found with the given ID');
      } 
      return result;
    }
    catch (err) {
      console.error('Error updating application:', err.message);
      throw err;
    }

  }
  static async deleteById(id) {
    const db = getdb();
    try {
      const result = await db.collection('applications').deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        throw new Error('No application found with the given ID');
      }
      return result;
    } catch (err) {
      console.error('Error deleting application:', err.message);
      throw err;
    }
  }
  

}


module.exports = Application;