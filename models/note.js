const getdb = require('../config/db').getdb;

class Note {
  constructor(content, applicationId) {
    this.content = content;
    this.applicationId = applicationId;
  }

  async save() {
    const db = getdb();
    try {
      const result = await db.collection('notes').insertOne(this);
      return result.ops?.[0] || { insertedId: result.insertedId, ...this };
    } catch (err) {
      console.error('Error saving note:', err.message);
      throw err;
    }
  }

  static async findByApplicationId(applicationId) {
    const db = getdb();
    try {
      const notes = await db.collection('notes').find({ applicationId }).toArray();
      return notes;
    } catch (err) {
      console.error('Error fetching notes by application ID:', err.message);
      throw err;
    }
  }
}


 module.exports = Note;