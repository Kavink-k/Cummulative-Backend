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
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE, 
  process.env.MYSQLUSER,     
  process.env.MYSQLPASSWORD, 
  {
    host: process.env.MYSQLHOST, 
    port: process.env.MYSQLPORT || 3306,
    dialect: 'mysql',
    dialectModule: require('mysql2'), 
    logging: false,
    dialectOptions: {
      connectTimeout: 60000 // Gives Railway extra time to establish the link
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to Railway MySQL via Public Proxy!');
  })
  .catch(err => {
    console.error('❌ Connection still failing:', err);
  });

module.exports = sequelize;