import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 4000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let posts = [
    {
        id: 1,
        title: "title1",
        content: "content1",
        author: "author1",
        date: new Date(),
    },
    {
        id: 2,
        title: "title2",
        content: "content2",
        author: "author2",
        date: new Date(),
    },
    {
        id: 3,
        title: "title3",
        content: "content3",
        author: "author3",
        date: new Date(),
    }
]
let lastId = 3;
const masterKey = "10172023";

//get all
app.get("/posts", (req, res) => {
    res.status(200).json(posts)
})
//get specific one
app.get("/posts/:id", (req, res) => {
    const foundPostIndex = posts.findIndex((post) => post.id === parseInt(req.params.id));
    if (foundPostIndex !== -1) {
        res.status(200).json(posts[foundPostIndex]);
    } else {
        res.status(404).send("No matched post found");
    }
})
//post new one
app.post("/posts", (req, res) => {
    const post = {
        id: lastId +=1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: new Date(),
    }
    posts.push(post);
    res.status(200).json(posts);
})
//PUT
app.put("/posts/:id", (req, res) => {
    const index = posts.findIndex((post) => post.id === parseInt(req.params.id));
    const originalPost = posts[index];
    if (index !== -1) {
        posts[index] = {
            id: originalPost.id,
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            date: new Date(),
        }
        res.status(200).json(posts);
    } else {
        res.status(404).json( { Message: "No matched post found"});
    }
})
//PATCH
app.patch("/posts/:id", (req, res) => {
    const index = posts.findIndex((post) => post.id === parseInt(req.params.id));
    const originalPost = posts[index];
    if (index !== -1) {
        if (req.body.title) {posts[index].title = req.body.title;};
        if (req.body.content) {posts[index].content = req.body.content;};
        if (req.body.author) {posts[index].author = req.body.author;};
        res.status(200).json(posts[index]);
    } else {
        res.status(404).json( { Message: " No matched post found"});
    }
})
//delete one
app.delete("/posts/:id", (req, res) => {
    const foundPostIndex = posts.findIndex((post) => post.id === parseInt(req.params.id))
    if (foundPostIndex !== -1) {
        posts.splice(foundPostIndex, 1);
        res.sendStatus(200)
    } else {
        res.status(404).send("No matched post found");
    }
})
//delete all
app.delete("/api/posts/all", (req, res) => {
    const userKey = req.headers.key;
    if (userKey === masterKey) {
        posts = [];
        res.sendStatus(200);
    } else {
        res.status(400).json( { Message : "You are not authorized."});
    }
})

// listen
app.listen(port, (req, res) => {
    console.log(`Server is on port ${port}`);
})