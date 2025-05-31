const mongodb = require('../config/db').getdb;
const { ObjectId } = require('mongodb');

class User {
  constructor(name, email, password, phone, isAdmin, street, apartment, zip, city, country) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.isAdmin = isAdmin || false; // Default to false if not provided
    this.street = street;
    this.apartment = apartment;
    this.zip = zip;
    this.city = city;
    this.country = country;
  }
  async save() {
    const db = mongodb();
    try {
      const result = await db.collection('users').insertOne(this);
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async findByEmail(email) {
    const db = mongodb();
    return db.collection('users').findOne({ email });
  }

  static async findById(userId) {
    const db = mongodb();
    return db.collection('users').findOne({ _id: new ObjectId(userId) });
  }

  static async updateProfile(userId, updateData) {
    const db = mongodb();
    return db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
  }


}

module.exports = User;