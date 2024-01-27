import express from "express";

const app = express();
const port = 3000;
app.get("/", (req, res)=>{
    res.send("<h1>Hello</h1>");
})
app.get("/contact", (req, res)=>{
    res.send("<h1>Contact info: 888 788 8888</h1>");
})
app.get("/about", (req, res)=>{
    res.send("<p>This is an about page. You will get to know me!</p>");
})

app.listen(port, ()=> {
    console.log(`server is on for ${port}!`);
})