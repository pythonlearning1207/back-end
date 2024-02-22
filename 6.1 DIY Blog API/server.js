import bodyParser from "body-parser";
import express from "express";
import axios from "axios";
const headers = {
    key: "10172023",
}
const app = express();
const port = 3000;
const API_URL = "http://localhost:4000"
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//render main page
app.get("/", async(req, res) => {
    const result = await axios.get(`${API_URL}/posts`);
    res.render("index.ejs", { posts: result.data});
})
//edit new post
app.get("/new", (req, res) => {
    res.render("modify.ejs", {
        title : "Creating a new post",
        button: "Submit"
    })
})
//edit existing post
app.get("/edit/:id", async(req, res) => {
    try {
        const result = await axios.get(`${API_URL}/posts/${req.params.id}`);
        console.log(result.data);
        res.render("modify.ejs", {
            post: result.data,
            title: "Editing a post",
            button: "Change",
        })      
    } catch (error) {
        res.status(404).send("No matched post found");
    }
    
})

//post new one
app.post("/api/post", async(req, res) => {
    const result = await axios.post(`${API_URL}/posts`, req.body);
    console.log(result.data);
    res.redirect("/");
})
//put
app.post("/api/post/edit/:id", async(req, res) => {
    const result = await axios.put(`${API_URL}/posts/${req.params.id}`, req.body);
    console.log(result.data);
    res.redirect("/");
})
//patch
app.post("/api/post/edit/:id", async(req, res) => {
    const result = await axios.patch(`${API_URL}/posts/${req.params.id}`, req.body);
    console.log(result.data);
    res.redirect("/");
})
//delete one
app.get("/delete/:id", async(req, res) => {
    const result = await axios.delete(`${API_URL}/posts/${req.params.id}`);
    console.log(result);
    res.redirect("/");
})
//delete all
app.get("/api/delete/all", async(req, res)=> {
    try {
        const result = await axios.delete(`${API_URL}/api/posts/all`, {headers: headers});
        console.log(result);
        res.redirect("/");
    } catch (error) {
        res.status(400).json( { Message : "You are not authorized."});
    }
    
})
//listen
app.listen(port, (req, res) => {
    console.log(`Server is on port ${port}`);
})