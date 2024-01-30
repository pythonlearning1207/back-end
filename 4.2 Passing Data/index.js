import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  app.render("index.ejs", {
    htmlContent: "<h1>Enter your name below:</h1>"
  })
});

app.post("/submit", (req, res) => {
  const nameLength = (req.body['fName']+req.body['lName']).length;
  app.render("index.ejs", {
    htmlContent: `There are ${nameLength} letters in your name`
  })
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
