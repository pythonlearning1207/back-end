import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
let countries = [];
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Jia3202128",
  port: 5432
})
db.connect( err =>{
  if (err) {
    console.error("Error connecting: ", err.stack);
  } else {
    console.log("Connected to the database succesfuly");
  }
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  //Write your code here.
  db.query("SELECT country_code FROM visited_countries", (err, queryRes) => {
    if (err) {
      console.err("Error query: ", err.stack);
    } else{
      countries = queryRes.rows.map(row => row.country_code);
      let total = countries.length;
      console.log(countries)
      res.render("index.ejs", {
        countries,
        total
      })
    }
  })
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
