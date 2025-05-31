const getdb = require('../config/db').getdb;

class reminder {
  constructor(reminderDate, applicationId) {
    this.reminderDate = reminderDate;
    this.applicationId = applicationId;
  }

  async save() {
    const db = getdb();
    try {
      const result = await db.collection('reminders').insertOne(this);
      return result.ops?.[0] || { insertedId: result.insertedId, ...this };
    } catch (err) {
      console.error('Error saving reminder:', err.message);
      throw err;
    }
  }

  static async findByApplicationId(applicationId) {
    const db = getdb();
    try {
      const reminders = await db.collection('reminders').find({ applicationId }).toArray();
      return reminders;
    } catch (err) {
      console.error('Error fetching reminders by application ID:', err.message);
      throw err;
    }
  }

  
  static async find() {
    const db = getdb();
    try {
      const reminders = await db.collection('reminders').find({}).toArray();
      return reminders;
    } catch (err) {
      console.error('Error fetching reminders:', err.message);
      throw err;
    }
  }
}

module.exports = reminder;