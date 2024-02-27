import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Jia3202128",
  port: 5432,
})
let countries;
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisited(){
  let result = await db.query("SELECT country_code FROM visited_countries");
  let data = result.rows;
  let countries = [];
  data.forEach(country => {
    countries.push(country.country_code);
  })
  return countries;
}
app.get("/", async (req, res) => {
  //Write your code here.
  let countries = await checkVisited();
  let total = countries.length;
  res.render("index.ejs", {
    total: total,
    countries: countries,
  })
});
///add
app.post("/add", async(req, res)=> {
  let country = req.body.country
  let result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%'||$1||'%';", [country.toLowerCase()]);
  result = result.rows;
  if (result.length !== 0) {
      // country_code
      result = result[0].country_code
      // countries_visited[]
      let check = await checkVisited();
      if (check.includes(result)) {
        res.render("index.ejs",{
          total: check.length,
          countries: check,
          error: "Country has already been added. try again",
        })
      } else {
        db.query("INSERT INTO visited_countries(country_code) VALUES($1)", [result]);
        res.redirect('/');  
      }
  } else if (result.length === 0) {
      let result = await checkVisited();
      res.render("index.ejs", {
        total: result.length,
        countries: result,
        error: "Country name does not exist, try again",
      })
  }
  
  });


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
