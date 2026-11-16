const mongoose = require('mongoose');
const environment = require('./environment');

let cachedConnection = null;

const connectDatabase = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const connection = await mongoose.connect(environment.MONGODB_URI, {
    bufferCommands: false,
    autoIndex: true,
  });

  cachedConnection = connection;
  return connection;
};

module.exports = connectDatabase;
