const fs = require("fs");
require('dotenv').config()
// fs.readFile("test.txt", "utf8", (err, data) => {
//   if (err) throw err;
//   console.log(data);
console.log(process.env.NAME, process.env.NODE_ENV);