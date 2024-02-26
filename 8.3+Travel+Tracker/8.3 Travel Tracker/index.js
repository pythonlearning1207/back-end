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

app.get("/", async (req, res) => {
  //Write your code here.
  db.query("SELECT country_code FROM visited_countries", (err, queryRes) => {
    if (err) {
      console.error("Error: ", err.stack);
    } else {
    //   let total;
    //   countries = queryRes.rows.map(row => row.country_code);
    //   total = countries.length;
    //   console.log(countries);
    //   res.render("index.ejs", {
    //     total,
    //     countries,
    //   })
      let countries = queryRes.rows;
      console.log(countries);
      let formattedCountriesArr = [];
      countries.forEach(country => {
        formattedCountriesArr.push(country.country_code);
      })
      console.log(formattedCountriesArr);
      res.render("index.ejs", {
        total: formattedCountriesArr.length,
        countries: formattedCountriesArr,
      })
   }
  })
});
///add
app.post("/add", async(req, res)=> {
  let country = req.body.country.trim();
  country = [country.charAt(0).toUpperCase() + country.slice(1).toLowerCase()];
  let country_code = await db.query("SELECT code FROM public.country_code WHERE name = $1", country);
  let newArr = (country_code.rows);
  let code = (newArr[0].code);
  await db.query("INSERT INTO visited_countries(country_code) VALUES($1)", [code]);
  res.redirect('/');
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
