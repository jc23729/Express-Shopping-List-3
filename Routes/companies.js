// Routes for companies
const express = require("express");
const slugify = require("slugify");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();


/**Step 2: Add Company Routes
Create routes/companies.js with a router in it.

All routes in this file should be found under companies/.

All routes here will respond with JSON responses. These responses will be in an object format where the value is the data from the database.

So, for example, the “get list of companies should return”:

{companies: [{code, name}, ...]}
Assuming result is the result from your query, you could produce this with a line like:

return res.json({companies: result.rows})
These routes need to be given data in JSON format, not the standard “url-encoded form body” — so you’ll need to make sure that your app.js includes the middleware to parse JSON.

Routes Needed
GET /companies
Returns list of companies, like {companies: [{code, name}, ...]} */

/** GET / => list of companies.
 *
 * =>  {companies: [{code, name, descrip}, {code, name, descrip}, ...]}
 *
 * */
 router.get("/", async function (req, res, next) {
    try {
      const result = await db.query(
            `SELECT code, name 
             FROM companies 
             ORDER BY name`
      );
  
      return res.json({"companies": result.rows});
    }
  
    catch (err) {
      return next(err);
    }
  });