/** Database setup for BizTime. */


const { Client } = require("pg");

const client = new Client({
  // connectionString: "postgresql:///biztime"
  user: "postgres",
  database: "biztime",
  host: "localhost",
  port: 5432
});

client.connect();


module.exports = client;