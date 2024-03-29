// const config = require("../config");
// const mysql = require("mysql2");
// const pool = mysql.createPool({
//   host: process.env.MYSQLHOST || config.mysqlHost,
//   user: process.env.MYSQLUSER || config.user,
//   password: process.env.PASSWORD || config.password, 
//   database: process.env.DATABASE || config.database,
//   port: process.env.MYSQLPORT|| config.PortNumber,
// });

// console.log("Database Connected Successfully!");
// const promisePool = pool.promise();
// console.log(promisePool,"yahah");


// module.exports = promisePool;

const config = require("../config");
const mysql = require("mysql2");



const pool = mysql.createPool({
  host: '166.62.27.150',
  user: "sahil",
  password: "8wA*wnua12O)",
  database: "ApurvaElectric",
  port: 3306, 
  
}); 
  

// Check for errors during the connection process
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database Connected Successfully!');
    // Perform any necessary database operations here
    connection.release(); // Release the connection back to the pool
  }
});

const promisePool = pool.promise();

module.exports = promisePool;

