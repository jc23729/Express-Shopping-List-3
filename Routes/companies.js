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



  /** GET /[code] => detail on company
 *
 * =>  {company: {code, name, descrip, invoices: [id, ...]}}
 *
 * */

router.get("/:code", async function (req, res, next) {
  try {
    let code = req.params.code;

    const compResult = await db.query(
          `SELECT code, name, description
           FROM companies
           WHERE code = $1`,
        [code]
    );

    const invResult = await db.query(
          `SELECT id
           FROM invoices
           WHERE comp_code = $1`,
        [code]
    );

    if (compResult.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404)
    }

    const company = compResult.rows[0];
    const invoices = invResult.rows;

    company.invoices = invoices.map(inv => inv.id);

    return res.json({"company": company});
  }

  catch (err) {
    return next(err);
  }
});
  
// POST /companies
// Adds a company.

// Needs to be given JSON like: {code, name, description}

// Returns obj of new company: {company: {code, name, description}}

router.post("/", async function (req, res, next) {
  try {
    let {name, description} = req.body;
    let code = slugify(name, {lower: true});

    const result = await db.query(
          `INSERT INTO companies (code, name, description) 
           VALUES ($1, $2, $3) 
           RETURNING code, name, description`,
        [code, name, description]);

    return res.status(201).json({"company": result.rows[0]});
  }

  catch (err) {
    return next(err);
  }
});

  module.exports = router;