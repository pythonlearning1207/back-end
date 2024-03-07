import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"secrets",
  password:"Jia3202128",
  port:5432
})
db.connect();
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const email = req.body.username;
    const password = req.body.password;
    const checkResult = await db.query("SELECT email from users WHERE email = $1;",[email]);
    if (checkResult.rows.length > 0) {
      res.send("Email already exists.");
    } else{
      await db.query("INSERT INTO users(email, password) VALUES($1, $2);",[email,password]);
      console.log("User registerd succesfully!");
      res.redirect("/");
    };
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const checkResult = await db.query("SELECT * FROM users where email = $1", [email]);
    if (checkResult.rows.length > 0) {
      const passwordFromDB = checkResult.rows[0].password;
      if (passwordFromDB === password) {
        console.log("Logged in!");
        res.render("secrets.ejs");
      } else {
        res.send("Wrong password. Try again");
      }
    } else {
      res.send("You have not registred yet");
    }
    const result = await db.query("SELECT password FROM users WHERE email = $1",[email]);
    const matchedPassword = result.rows[0].password;
    
  } catch (error) {
     console.log(error);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
