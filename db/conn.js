const mongoose = require('mongoose');

const connectionString = process.env.ATLAS_URI || '';
const mongoDbConfig = async () => {
  try {
    const result = await mongoose.connect(connectionString);
    console.log('Conneted to database succesffuly');
  } catch (err) {
    console.log('Failed to connect to database: ', err);
  }
};

module.exports = mongoDbConfig;
