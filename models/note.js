const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class NoteSchema extends Schema {
  constructor() {
    super({
      content: { type: String, required: true },
      applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true }
    });
  }

  // Static method to create a new note
  static async createNote(data) {
    return this.create(data);
  }

  // Static method to find notes by application ID
  static async findByApplicationId(applicationId) {
    return this.find({ applicationId });
  }
}

module.exports = mongoose.model('Note', NoteSchema);


// const getdb = require('../config/db').getdb;

// class Note {
//   constructor(content, applicationId) {
//     this.content = content;
//     this.applicationId = applicationId;
//   }

//   async save() {
//     const db = getdb();
//     try {
//       const result = await db.collection('notes').insertOne(this);
//       return result.ops?.[0] || { insertedId: result.insertedId, ...this };
//     } catch (err) {
//       console.error('Error saving note:', err.message);
//       throw err;
//     }
//   }

//   static async findByApplicationId(applicationId) {
//     const db = getdb();
//     try {
//       const notes = await db.collection('notes').find({ applicationId }).toArray();
//       return notes;
//     } catch (err) {
//       console.error('Error fetching notes by application ID:', err.message);
//       throw err;
//     }
//   }
// }


//  module.exports = Note;