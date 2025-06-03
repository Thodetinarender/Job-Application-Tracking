const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false, // Default to false if not provided
  },
  street: String,
  apartment: String,
  zip: String,
  city: String,
  country: String,
  careerGoals: String
});


// Static method to find user by email
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Static method to update user profile
UserSchema.statics.updateProfile = function(userId, updateFields) {
  return this.findByIdAndUpdate(userId, updateFields, { new: true });
};



module.exports = mongoose.model('User', UserSchema);

// const mongodb = require('../config/db').getdb;
// const { ObjectId } = require('mongodb');

// class User {
//   constructor(name, email, password, phone, isAdmin, street, apartment, zip, city, country) {
//     this.name = name;
//     this.email = email;
//     this.password = password;
//     this.phone = phone;
//     this.isAdmin = isAdmin || false; // Default to false if not provided
//     this.street = street;
//     this.apartment = apartment;
//     this.zip = zip;
//     this.city = city;
//     this.country = country;
//   }
//   async save() {
//     const db = mongodb();
//     try {
//       const result = await db.collection('users').insertOne(this);
//       return result;
//     } catch (err) {
//       throw err;
//     }
//   }

//   static async findByEmail(email) {
//     const db = mongodb();
//     return db.collection('users').findOne({ email });
//   }

//   static async findById(userId) {
//     const db = mongodb();
//     return db.collection('users').findOne({ _id: new ObjectId(userId) });
//   }

//   static async updateProfile(userId, updateData) {
//     const db = mongodb();
//     return db.collection('users').findOneAndUpdate(
//       { _id: new ObjectId(userId) },
//       { $set: updateData },
//       { returnDocument: 'after' }
//     );
//   }


// }

// module.exports = User;