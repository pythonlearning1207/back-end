import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.send()
})
app.post("/submit", (req, res) => {
  console.log(req.body);
  //res.send("<h1>Your band name is:</h1>");
})
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
