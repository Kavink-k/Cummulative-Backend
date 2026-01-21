// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 3306,
//     dialect: 'mysql',
//     dialectModule: require('mysql2'),
//     logging: false, // Set to console.log to see SQL queries
//   }
// );
// // Test the connection
// sequelize.authenticate()
//   .then(() => {
//     console.log('Database connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// module.exports = sequelize;




const { Sequelize } = require('sequelize');
// Note: On Railway, you don't strictly need dotenv as Railway injects vars directly,
// but keeping it won't hurt as long as your .env is ignored by git.
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE, // Changed from DB_NAME
  process.env.MYSQLUSER,     // Changed from DB_USER
  process.env.MYSQLPASSWORD, // Changed from DB_PASSWORD
  {
    host: process.env.MYSQLHOST, // Changed from DB_HOST
    port: process.env.MYSQLPORT || 3306,
    dialect: 'mysql',
    dialectModule: require('mysql2'), // Good practice to keep this for deployment
    logging: false,
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Railway MySQL connection established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });

module.exports = sequelize;