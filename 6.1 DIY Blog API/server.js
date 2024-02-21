import bodyParser from "body-parser";
import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000"
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//render main page
app.get("/", async(req, res) => {
    const result = await axios.get(`${API_URL}/posts`);
    console.log(result.data);
    res.render("index.ejs", { posts: result.data});
})
//get specific one

//post new one

//put

//patch

//delete one

//delete all

//listen
app.listen(port, (req, res) => {
    console.log(`Server is on port ${port}`);
})