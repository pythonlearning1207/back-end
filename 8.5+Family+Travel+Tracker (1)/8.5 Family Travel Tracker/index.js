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
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];
// refresh users[]
async function getCurrentUsers() {
  const result = await db.query("SELECT * FROM users");
  users = result.rows;
}
// checkVisited()
async function checkVisited(user_id) {
  const result = await db.query(
    "SELECT country_code FROM visited_countries WHERE user_id=$1",
    [user_id]
    );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
//check color()
async function checkColor(currentUserId){
  const result = await db.query(
    "SELECT color FROM users WHERE id=$1",
    [currentUserId]);
  const data = result.rows;
  const color = data[0].color;
  return color;
}

// main
app.get("/", async (req, res) => {
  await getCurrentUsers();
  const countries = await checkVisited(currentUserId);
  const color = await checkColor(currentUserId);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: color,
  });
});
// /add country
app.post("/add", async (req, res) => {
  if (req.body.country === '') {
    res.redirect('/');
  } else {
    const input = req.body["country"];
     const userId = currentUserId;
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );
    const data = result.rows[0];
    const countryCode = data.country_code;

    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, userId]
      );
      res.redirect("/");
    } catch (err) {
      const countries = await checkVisited(currentUserId);
      const color = await checkColor(currentUserId);
      res.render("index.ejs", {
        users: users,
        total: countries.length,
        countries: countries,
        color: color,
        error: "Country has been added already.",
      })
    }
  } catch (err) {
    const countries = await checkVisited(currentUserId);
    const color = await checkColor(currentUserId);
    console.log(err);
    res.render("index.ejs", {
      users: users,
      total: countries.length,
      countries: countries,
      color: color,
      error: "Can't find the country. Please check the spelling and try agian",
    })
  }
  }
  
});

// /user selection
app.post("/user", async (req, res) => {
    if (req.body.add === "new") {
        res.render("new.ejs");
    } else {
      try {
        const userSelection = req.body.user;
        currentUserId = userSelection;
        const color = await checkColor(userSelection);
        // console.log(color);
        const countries = await checkVisited(userSelection);
        // console.log(countries);
        res.render("index.ejs", {
          total: countries.length,
          countries: countries,
          color: color,
          users: users,
        })
      } catch (error) {
        console.log(error);
      }
    }

});
app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const username = req.body.name;
  const color = req.body.color;
  try {
    const result = await db.query("INSERT INTO users(name, color) VALUES($1, $2) RETURNING *;",
    [username, color]
    );
    currentUserId = result.rows[0].id ;
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
