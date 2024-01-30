import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", (req, res)=>{
  res.render("index.ejs");
})

app.post("/submit", (req, res)=>{
  const bandName = adj[Math.floor(Math.random() * adj.length)] + " " + noun[Math.floor(Math.random() * noun.length)];
  res.render("index.ejs", {bandName});
})

app.listen(port, (req, res)=>{
  console.log(`server on port ${port}`);
})

const adj = [
  "smart",
  "beautiful",
  "cute",
  "amazing",
  "strong",
  "mighty",
  "crazy",
]

const noun = [
  "bread",
  "banana",
  "apple",
  "orange",
  "red wine",
  "cup",
  "desk",
]