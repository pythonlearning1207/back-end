import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false })); 

app.listen(port, (req, res)=>{
    console.log(`Server on port ${port}`);
});

app.get("/", (req, res)=>{
    res.render("index.ejs",
    {htmlContent: "<h1>Enter your name below</h1>"}
    );
})

app.post("/submit", (req, res)=>{
    const fullName = req.body['fName'] + req.body['lName'];
    const nameLength = fullName.length;
    res.render("index.ejs", {
        htmlContent: `<h1>There are ${nameLength} letters in your name. </h1>`
    });
})
