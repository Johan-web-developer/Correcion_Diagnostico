const { MongoClient } = require('mongodb');

async function connectDB() {
  try {
    const client = await MongoClient.connect('mongodb+srv://user:12345@farmacia.xoypicz.mongodb.net/');
    const db = client.db('farmaciaCampus');
    return db;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

module.exports = { connectDB };
