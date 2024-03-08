import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const saltRounds = 10;

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
  const email = req.body.username;
  const password = req.body.password;
  try {
    const checkResult = await db.query("SELECT email from users WHERE email = $1;",[email]);
    if (checkResult.rows.length > 0) {
      res.send("Email already exists.");
    } else{
      // password Hashing
      bcrypt.hash(password, saltRounds, async(err, hash)=>{
        if (err) {
          console.log("Error hashing: " + err);
        } else {
          const insertResult = await db.query("INSERT INTO users(email, password) VALUES($1, $2);",[email,hash]);
          console.log("registration done!");
          res.redirect("/");
        }
      })
      
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
      const storedHashedPassword = checkResult.rows[0].password;
      bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
          console.log("Errer comparing passwords: " + err);
        } else {
          console.log(result);
          if (result) {
            res.render("secrets.ejs");
          } else {
            res.send("Wrong password. Try again");
          }
        }
      })      
    } else {
      res.send("You have not registred yet");
    }
  } catch (error) {
     console.log(error);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
